import { type CDPSession, expect, type Page } from '@playwright/test';

export const SCREENSHOT_DIR = 'e2e/artifacts/screenshots';

type Mode = 'B1' | 'B2';
type Scenario = 'free' | 'hill' | 'parking' | 'exam' | 'road';

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
    // The approach is driven from inside the page, one decision per HUD update, so the Playwright
    // round trip adds no delay. A software-rendered frame can still take half a second, in which
    // the car covers more than the 50 cm stop zone, so the driver brakes for where the car will be
    // by its next look and, when that leaves it short of the zone, creeps up on the clutch.
    await this.page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          const key = (type: 'keydown' | 'keyup', code: string) =>
            window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true, cancelable: true }));
          const hold = (code: string, down: boolean) => key(down ? 'keydown' : 'keyup', code);
          const text = (id: string) => document.querySelector(`[data-testid=${id}]`)?.textContent ?? '';
          const number = (id: string) => Number.parseFloat(text(id));
          /** Longest gap between HUD updates seen lately, seconds. */
          let lag = 0.3;
          let seen = '';
          let seenAt = performance.now();
          let state: 'drive' | 'coast' | 'stop' | 'rev' | 'bite' | 'creep' = 'drive';
          let creeps = 0;
          const brake = () => {
            hold('KeyW', false);
            hold('KeyC', true);
            hold('KeyX', false);
            hold('KeyS', true);
            state = 'stop';
          };
          const tick = () => {
            const hint = text('hud-hint');
            const match = hint.match(/còn ([\d.]+) m/);
            const gap = match ? Number(match[1]) : 0;
            const speed = number('hud-speed');
            const now = performance.now();
            const reading = `${hint}|${speed}`;
            if (reading !== seen) {
              lag = Math.min(0.7, Math.max(lag * 0.8, (now - seenAt) / 1000));
              seen = reading;
              seenAt = now;
            }
            const v = speed / 3.6;
            // Bumper to line once the brakes have bitten, if they go on at the next look.
            const stopsAt = gap - v * lag - (v * v) / 12;
            if (!match) {
              brake();
              resolve();
              return;
            }
            if (state === 'drive') {
              // No throttle on the last metres: first gear idles up the slope at walking pace.
              hold('KeyW', gap > 4 && speed < 6.5);
              if (stopsAt < 0.9) {
                hold('KeyW', false);
                // Clutch in first: braking in gear would stall the engine.
                hold('KeyC', true);
                state = 'coast';
              }
            } else if (state === 'coast') {
              if (stopsAt < 0.2 || speed < 1.5) brake();
            } else if (state === 'stop') {
              if (speed < 0.05) {
                if (gap <= 0.45 || creeps >= 4) {
                  resolve();
                  return;
                }
                creeps += 1;
                hold('KeyW', true);
                state = 'rev';
              }
            } else if (state === 'rev') {
              if (number('hud-rpm') > 2000) {
                // Bite-point key instead of the clutch key: the clutch rises to the bite and stays.
                hold('KeyX', true);
                hold('KeyC', false);
                state = 'bite';
              }
            } else if (state === 'bite') {
              hold('KeyW', number('hud-rpm') < 2600);
              if (number('hud-clutch') <= 58) {
                hold('KeyS', false);
                state = 'creep';
              }
            } else {
              hold('KeyW', number('hud-rpm') < 2600);
              if (stopsAt < 0.25) brake();
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

  /** Puts a finger down at a point of the page. */
  async touch(x: number, y: number) {
    const id = this.nextId++;
    this.down.set(id, { x: Math.round(x), y: Math.round(y), id });
    await this.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [...this.down.values()] });
    return id;
  }

  /** Slides one finger while the others stay where they are. */
  async slide(id: number, x: number, y: number) {
    if (!this.down.has(id)) throw new Error(`finger ${id} is not down`);
    this.down.set(id, { x: Math.round(x), y: Math.round(y), id });
    await this.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [...this.down.values()] });
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
