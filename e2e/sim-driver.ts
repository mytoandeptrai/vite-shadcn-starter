import { type CDPSession, expect, type Page } from '@playwright/test';

export const SCREENSHOT_DIR = 'e2e/artifacts/screenshots';

type Mode = 'B1' | 'B2';
type Scenario = 'free' | 'hill' | 'parking' | 'road';

/** Drives the simulator through its UI and reads the HUD like a learner would. */
export class SimDriver {
  constructor(readonly page: Page) {}

  async open(quality?: 'high' | 'low') {
    await this.page.goto(quality ? `/?quality=${quality}` : '/');
    await expect(this.page.getByTestId('scenario-modal')).toBeVisible();
    await expect(this.page.locator('canvas').first()).toBeVisible();
  }

  async start(mode: Mode, scenario: Scenario) {
    await this.page.getByTestId(`exam-mode-${scenario === 'road' ? 'road' : 'yard'}`).click();
    await this.page.getByTestId(`mode-${mode}`).click();
    if (scenario !== 'road') await this.page.getByTestId(`scenario-${scenario}`).click();
    await this.page.getByTestId('start-button').click();
    await expect(this.page.getByTestId('hud')).toBeVisible();
    // The first frames compile shaders; wait until the simulation clock is running.
    await expect(this.page.getByTestId('hud-rpm')).not.toHaveText('0');
  }

  async screenshot(name: string) {
    await this.page.screenshot({ path: `${SCREENSHOT_DIR}/${name}.png`, fullPage: true });
  }

  private async number(testId: string) {
    return Number.parseFloat((await this.page.getByTestId(testId).textContent()) ?? '');
  }

  speed = () => this.number('hud-speed');
  rpm = () => this.number('hud-rpm');
  clutch = () => this.number('hud-clutch');
  score = () => this.number('hud-score');
  steer = () => this.number('steer-angle');
  hint = async () => (await this.page.getByTestId('hud-hint').textContent()) ?? '';
  phase = () => this.page.locator('.ds-root').getAttribute('data-phase');

  async waitFor(read: () => Promise<number>, test: (value: number) => boolean, timeout = 30_000) {
    await expect.poll(async () => test(await read()), { timeout, intervals: [80] }).toBe(true);
  }

  /** B2: clutch to the floor, then select a gear. */
  async engage(gear: '1' | '2' | 'R') {
    const k = this.page.keyboard;
    await k.down('KeyC');
    await this.waitFor(this.clutch, (v) => v >= 95);
    await k.press(gear === 'R' ? 'KeyR' : `Digit${gear}`);
    await expect(this.page.getByTestId('hud-gear')).toHaveText(gear);
  }

  /** B2: pull away from standstill in the current gear (handbrake already released). */
  async pullAway() {
    const k = this.page.keyboard;
    await k.down('KeyW');
    await this.waitFor(this.rpm, (v) => v > 1800);
    await k.up('KeyC');
    await this.waitFor(this.speed, (v) => v > 3);
  }

  /** B2 hill exam: drive up the ramp and stop with the bumper just before the stop line. */
  async stopAtHillLine() {
    const k = this.page.keyboard;
    await this.engage('1');
    await k.press('Space');
    await this.pullAway();
    await k.up('KeyW');
    // The approach is driven from inside the page, one decision per rendered frame, so a slow
    // headless WebGL frame rate or the Playwright round trip cannot make the car overshoot.
    await this.page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          const key = (type: 'keydown' | 'keyup', code: string) =>
            window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true, cancelable: true }));
          const text = (id: string) => document.querySelector(`[data-testid=${id}]`)?.textContent ?? '';
          let coasting = false;
          const tick = () => {
            const match = text('hud-hint').match(/còn ([\d.]+) m/);
            const gap = match ? Number(match[1]) : 0;
            const speed = Number.parseFloat(text('hud-speed'));
            if (!match || gap < 0.6 || (coasting && speed < 1.5)) {
              key('keydown', 'KeyS');
              resolve();
              return;
            }
            if (!coasting && gap < 0.9) {
              // Clutch in first: braking in gear would stall the engine.
              coasting = true;
              key('keyup', 'KeyW');
              key('keydown', 'KeyC');
            } else if (!coasting) {
              key(speed < 6.5 ? 'keydown' : 'keyup', 'KeyW');
            }
            requestAnimationFrame(tick);
          };
          tick();
        })
    );
    // Take over the pedals held by the in-page driver.
    await k.down('KeyC');
    await k.down('KeyS');
    await this.waitFor(this.speed, (v) => v < 0.05);
    // Hold the car on the slope with the handbrake.
    await k.press('Space');
    await k.up('KeyS');
    await expect(this.page.getByTestId('hud-hint')).toContainText('Khởi hành qua vạch');
  }

  /** B2 hill start: revs up, clutch to the bite point, then release the handbrake. */
  async hillStart() {
    const k = this.page.keyboard;
    await k.down('KeyW');
    await this.waitFor(this.rpm, (v) => v > 2200);
    // Swap the clutch key for the bite-point key, as the in-app guide teaches.
    await k.down('KeyX');
    await k.up('KeyC');
    await this.waitFor(this.clutch, (v) => v <= 58);
    await k.press('Space');
    await this.waitFor(this.speed, (v) => v > 3);
    await k.up('KeyX');
  }
}

interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

/** Real multi-touch through CDP: fingers that stay down while other fingers tap. */
export class Fingers {
  private readonly down = new Map<number, TouchPoint>();
  private nextId = 0;

  private constructor(
    private readonly page: Page,
    private readonly cdp: CDPSession
  ) {}

  static async on(page: Page) {
    return new Fingers(page, await page.context().newCDPSession(page));
  }

  private async centre(testId: string, fy = 0.5) {
    const box = await this.page.getByTestId(testId).boundingBox();
    if (!box) throw new Error(`${testId} not found`);
    return { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height * fy) };
  }

  async hold(testId: string, fy = 0.5) {
    const id = this.nextId++;
    this.down.set(id, { ...(await this.centre(testId, fy)), id });
    // touchStart lists every finger on the glass; the new one is the press.
    await this.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [...this.down.values()] });
    return id;
  }

  async lift(id: number) {
    const point = this.down.get(id);
    if (!point) throw new Error(`finger ${id} is not down`);
    this.down.delete(id);
    // touchEnd lists only the fingers leaving the glass.
    await this.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [point] });
  }

  async tap(testId: string, fy = 0.5) {
    const id = await this.hold(testId, fy);
    await this.page.waitForTimeout(60);
    await this.lift(id);
  }
}
