import { expect, test } from '@playwright/test';
import { Fingers, SimDriver } from './sim-driver';

test('mobile: touch steering wheel, pedals, clutch slider and H-shifter', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open('high');
  await sim.screenshot('03a-mobile-scenario-selector');
  await sim.start('B2', 'hill');

  // Clutch slider to the floor, then pick 1st on the H-shifter.
  const slider = await page.getByTestId('clutch-slider').boundingBox();
  if (!slider) throw new Error('clutch slider not found');
  const sliderX = slider.x + slider.width / 2;
  await page.touchscreen.tap(sliderX, slider.y + 3);
  await sim.waitFor(sim.clutch, (v) => v >= 95);
  await expect(page.getByTestId('gear-selector')).toBeVisible();
  await page.getByTestId('gear-1').tap();
  await expect(page.getByTestId('hud-gear')).toHaveText('1');

  // Drag the steering wheel a quarter turn clockwise.
  const wheel = await page.getByTestId('steering-wheel').boundingBox();
  if (!wheel) throw new Error('steering wheel not found');
  const cx = wheel.x + wheel.width / 2;
  const cy = wheel.y + wheel.height / 2;
  const r = wheel.width * 0.4;
  await page.mouse.move(cx, cy - r);
  await page.mouse.down();
  for (let a = 0; a <= 120; a += 10) {
    const rad = ((a - 90) * Math.PI) / 180;
    await page.mouse.move(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r);
  }
  expect(await sim.steer()).toBeGreaterThan(90);
  await page.mouse.up();
  // Released: the wheel springs back to centre.
  await sim.waitFor(sim.steer, (v) => Math.abs(v) < 2);

  // Controls shown in use: full right lock, clutch held down, 1st gear, brake pressed.
  await page.getByTestId('quick-right').tap();
  await sim.waitFor(sim.steer, (v) => v >= 539);
  const brake = await page.getByTestId('pedal-brake').boundingBox();
  if (!brake) throw new Error('brake pedal not found');
  await page.mouse.move(brake.x + brake.width / 2, brake.y + brake.height * 0.4);
  await page.mouse.down();
  await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%/);
  await sim.screenshot('03-mobile-controls');
  await page.mouse.up();
});

test('mobile multi-touch: a held brake pedal does not block the shifter, handbrake or toolbar', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open();
  await sim.start('B1', 'free');
  const fingers = await Fingers.on(page);

  // B1 rule: the brake must be held to leave P, so both fingers are down at once.
  const brake = await fingers.hold('pedal-brake', 0.3);
  await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%|100%/);
  await fingers.tap('gear-D');
  await expect(page.getByTestId('hud-gear')).toHaveText('D');
  await expect(page.getByTestId('gear-D')).toHaveAttribute('aria-pressed', 'true');

  // The automatic starts with the handbrake off: set it and release it with the brake still held.
  await expect(page.getByTestId('handbrake')).toHaveAttribute('aria-pressed', 'false');
  await fingers.tap('handbrake');
  await expect(page.getByTestId('handbrake')).toHaveAttribute('aria-pressed', 'true');
  await fingers.tap('handbrake');
  await expect(page.getByTestId('handbrake')).toHaveAttribute('aria-pressed', 'false');

  const camera = await page.getByTestId('camera-toggle').textContent();
  await fingers.tap('camera-toggle');
  await expect(page.getByTestId('camera-toggle')).not.toHaveText(camera ?? '');
  await fingers.tap('quick-right');
  await sim.waitFor(sim.steer, (v) => v >= 539);

  // The pedal stayed down the whole time; letting go lets the car creep.
  await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%|100%/);
  expect(await sim.speed()).toBeLessThan(0.5);
  await fingers.lift(brake);
  await sim.waitFor(sim.speed, (v) => v > 2);
});

test('mobile multi-touch: a held clutch does not block the H-shifter or the handbrake', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open();
  await sim.start('B2', 'free');
  const fingers = await Fingers.on(page);

  // One thumb keeps the clutch on the floor while the other works the gear gate.
  const clutch = await fingers.hold('clutch-slider', 0.03);
  await sim.waitFor(sim.clutch, (v) => v >= 95);
  await fingers.tap('gear-1');
  await expect(page.getByTestId('hud-gear')).toHaveText('1');
  await fingers.tap('gear-R');
  await expect(page.getByTestId('hud-gear')).toHaveText('R');

  await expect(page.getByTestId('handbrake')).toHaveAttribute('aria-pressed', 'true');
  await fingers.tap('handbrake');
  await expect(page.getByTestId('handbrake')).toHaveAttribute('aria-pressed', 'false');

  // The second finger never took the clutch away from the first.
  expect(await sim.clutch()).toBeGreaterThanOrEqual(95);
  await expect(page.getByTestId('engine-start')).toHaveText('Máy nổ');
  await fingers.lift(clutch);
});

test('mobile landscape: B2 controls fit the screen and the clutch presets pull the car away', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  const sim = new SimDriver(page);
  await sim.open();
  await sim.start('B2', 'free');

  // Every HUD block stays inside the viewport and the two control clusters do not overlap.
  const boxes = await page.evaluate(() =>
    [
      ...document.querySelectorAll('[data-testid=hud] > *, .ds-controls, .ds-pedals, [data-testid=hud] [data-testid]'),
    ].map((el) => {
      const r = el.getBoundingClientRect();
      return { name: el.className.split(' ')[0], left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    })
  );
  for (const box of boxes) {
    expect(box.left, box.name).toBeGreaterThanOrEqual(0);
    expect(box.top, box.name).toBeGreaterThanOrEqual(0);
    expect(box.right, box.name).toBeLessThanOrEqual(844);
    expect(box.bottom, box.name).toBeLessThanOrEqual(390);
  }
  const controls = boxes.find((b) => b.name === 'ds-controls');
  const pedals = boxes.find((b) => b.name === 'ds-area-pedals');
  expect(controls && pedals && controls.right < pedals.left).toBe(true);

  // Pull away with taps only, in the order the guide teaches: clutch down, 1st, handbrake off,
  // clutch to the bite point (the car creeps, the engine keeps running), then throttle.
  const fingers = await Fingers.on(page);
  await page.getByTestId('clutch-floor').tap();
  await sim.waitFor(sim.clutch, (v) => v >= 95);
  await page.getByTestId('gear-1').tap();
  await expect(page.getByTestId('hud-gear')).toHaveText('1');
  await page.getByTestId('handbrake').tap();
  await sim.screenshot('03b-mobile-landscape');
  await fingers.tap('clutch-bite');
  await sim.waitFor(sim.clutch, (v) => v <= 55);
  await sim.waitFor(sim.speed, (v) => v > 1.5);
  await expect(page.getByTestId('engine-start')).toHaveText('Máy nổ');
  const throttle = await fingers.hold('pedal-throttle', 0.45);
  await sim.waitFor(sim.speed, (v) => v > 5);
  await expect(page.getByTestId('engine-start')).toHaveText('Máy nổ');
  await fingers.tap('clutch-up');
  await sim.waitFor(sim.clutch, (v) => v <= 2);
  await expect(page.getByTestId('engine-start')).toHaveText('Máy nổ');
  await fingers.lift(throttle);
});
