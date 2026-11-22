import { expect, test } from '@playwright/test';
import { SimDriver } from './sim-driver';

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
  await page.getByTestId('shifter-button').tap();
  await expect(page.getByTestId('shifter-popup')).toBeVisible();
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

  // Controls shown in use: full right lock, clutch held down, H-shifter open, brake pressed.
  await page.getByTestId('quick-right').tap();
  await sim.waitFor(sim.steer, (v) => v >= 539);
  await page.getByTestId('shifter-button').tap();
  await expect(page.getByTestId('shifter-popup')).toBeVisible();
  const brake = await page.getByTestId('pedal-brake').boundingBox();
  if (!brake) throw new Error('brake pedal not found');
  await page.mouse.move(brake.x + brake.width / 2, brake.y + brake.height * 0.4);
  await page.mouse.down();
  await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%/);
  await sim.screenshot('03-mobile-controls');
  await page.mouse.up();
});
