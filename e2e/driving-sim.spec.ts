import { expect, test } from '@playwright/test';
import { SimDriver } from './sim-driver';

test.describe('screenshots', () => {
  test('scenario selector modal', async ({ page }) => {
    const sim = new SimDriver(page);
    await sim.open('high');
    await page.getByTestId('mode-B1').click();
    await expect(page.getByTestId('mode-B1')).toHaveAttribute('aria-pressed', 'true');
    await page.getByTestId('mode-B2').click();
    await page.getByTestId('scenario-hill').click();
    await page.waitForTimeout(1500);
    await sim.screenshot('01-scenario-selector');
  });

  test('desktop view: canvas, HUD, mirrors and active controls', async ({ page }) => {
    const sim = new SimDriver(page);
    await sim.open('high');
    await sim.start('B2', 'free');
    await sim.engage('1');
    await page.keyboard.press('Space');
    await sim.pullAway();
    await page.keyboard.down('KeyD');
    await sim.waitFor(sim.steer, (v) => v > 150);
    await expect(page.getByTestId('mirror-left')).toBeVisible();
    await expect(page.getByTestId('mirror-right')).toBeVisible();
    await expect(page.getByTestId('minimap')).toBeVisible();
    expect(await sim.speed()).toBeGreaterThan(3);
    await sim.screenshot('02-desktop-driving');
    await page.keyboard.up('KeyD');
    await page.keyboard.up('KeyW');

    // Camera toggle: driver seat, then top-down.
    await page.getByTestId('camera-toggle').click();
    await expect(page.getByTestId('camera-toggle')).toContainText('Ghế lái');
    await page.waitForTimeout(800);
    await sim.screenshot('02b-driver-camera');
  });

  test('hill-start scene: slope and stop line', async ({ page }) => {
    const sim = new SimDriver(page);
    // Default (auto) quality: stopping within 50 cm of the line needs the higher frame rate.
    await sim.open();
    await sim.start('B2', 'hill');
    await sim.stopAtHillLine();
    expect(await sim.score()).toBe(100);
    await page.waitForTimeout(600);
    await sim.screenshot('04-hill-start');
  });

  test('parking scene: sensor lines around the bay', async ({ page }) => {
    const sim = new SimDriver(page);
    await sim.open('high');
    await sim.start('B1', 'parking');
    // Automatic: brake, select D, release the brake and let the car creep into the lane.
    await page.keyboard.down('KeyS');
    await sim.waitFor(
      async () =>
        Number(
          await page
            .getByTestId('pedal-brake')
            .textContent()
            .then((t) => t?.match(/\d+/)?.[0])
        ),
      (v) => v > 50
    );
    await page.keyboard.press('KeyF');
    await expect(page.getByTestId('hud-gear')).toHaveText('D');
    await page.keyboard.up('KeyS');
    await sim.waitFor(sim.speed, (v) => v > 2);
    await expect(page.getByTestId('hud-hint')).toContainText('ghép xe vào nơi đỗ', { timeout: 30_000 });
    await page.waitForTimeout(2500);
    await page.keyboard.down('KeyS');
    await sim.waitFor(sim.speed, (v) => v < 0.05);
    await sim.screenshot('05-parking-bay');
    await page.getByTestId('camera-toggle').click();
    await page.getByTestId('camera-toggle').click();
    await expect(page.getByTestId('camera-toggle')).toContainText('Trên cao');
    await page.waitForTimeout(1200);
    await sim.screenshot('05b-parking-top-down');
  });
});

test('video demo: B2 hill-start exam, then B1 creep, steering and chip sensor', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open();
  await page.waitForTimeout(1000);

  // --- B2 manual: stop on the 10% slope, hill start, finish the exam.
  await sim.start('B2', 'hill');
  await sim.stopAtHillLine();
  await page.waitForTimeout(1500);
  await sim.hillStart();
  await expect(page.getByTestId('result-title')).toHaveText('ĐẠT', { timeout: 60_000 });
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(2500);

  // --- B2 free roam: dump the clutch to stall, restart, then steer lock to lock.
  await page.getByTestId('result-menu').click();
  await sim.start('B2', 'free');
  await sim.engage('1');
  await page.keyboard.press('Space');
  await page.keyboard.up('KeyC');
  const slider = await page.getByTestId('clutch-slider').boundingBox();
  if (!slider) throw new Error('clutch slider not found');
  await page.mouse.click(slider.x + slider.width / 2, slider.y + slider.height - 2);
  await expect(page.getByTestId('notice-fail')).toContainText('Chết máy');
  await page.waitForTimeout(1500);
  await page.keyboard.down('KeyC');
  await sim.waitFor(sim.clutch, (v) => v >= 95);
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('engine-start')).toContainText('Máy nổ');
  await sim.pullAway();
  await page.keyboard.up('KeyW');
  await page.getByTestId('quick-right').click();
  await sim.waitFor(sim.steer, (v) => v >= 539);
  await page.waitForTimeout(2500);
  await page.getByTestId('quick-left').click();
  await sim.waitFor(sim.steer, (v) => v <= -539);
  await page.waitForTimeout(2500);
  await page.getByTestId('quick-left').click();
  await sim.waitFor(sim.steer, (v) => Math.abs(v) < 2);

  // --- B1 automatic: creep in D, steer onto a chip line (−5), creep back in R.
  await page.getByTestId('open-menu').click();
  await sim.start('B1', 'parking');
  await page.keyboard.down('KeyS');
  await page.waitForTimeout(600);
  await page.keyboard.press('KeyF');
  await expect(page.getByTestId('hud-gear')).toHaveText('D');
  await page.keyboard.up('KeyS');
  await sim.waitFor(sim.speed, (v) => v > 3);
  await expect(page.getByTestId('hud-hint')).toContainText('ghép xe vào nơi đỗ', { timeout: 30_000 });
  await page.keyboard.down('KeyA');
  await expect(page.getByTestId('notice-penalty')).toContainText('−5 điểm', { timeout: 30_000 });
  await page.keyboard.up('KeyA');
  expect(await sim.score()).toBeLessThanOrEqual(95);
  await page.keyboard.down('KeyS');
  await sim.waitFor(sim.speed, (v) => v < 0.05);
  await page.keyboard.press('KeyR');
  await expect(page.getByTestId('hud-gear')).toHaveText('R');
  await page.keyboard.up('KeyS');
  await page.waitForTimeout(3500);
  await page.keyboard.down('KeyS');
  await page.waitForTimeout(1000);
});
