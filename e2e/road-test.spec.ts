import { expect, type Page, test } from '@playwright/test';
import { installRoadDriver } from './road-driver';
import { SimDriver } from './sim-driver';

const info = (page: Page, text: string) => page.getByTestId('notice-info').filter({ hasText: text });

test('road test: mode toggle, turn signals and the five steps, driven end to end in a B1 with no penalty', async ({
  page,
}) => {
  test.setTimeout(12 * 60_000);
  const sim = new SimDriver(page);
  await sim.open();

  // --- Mode toggle on the main screen.
  await expect(page.getByTestId('exam-mode-yard')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('scenario-hill')).toBeVisible();
  await page.getByTestId('exam-mode-road').click();
  await expect(page.getByTestId('exam-mode-road')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('scenario-hill')).toHaveCount(0);
  await expect(page.getByTestId('scenario-road')).toContainText('Thi Đường Trường');
  await page.waitForTimeout(1500);
  await sim.screenshot('07-road-mode-selector');

  await sim.start('B1', 'road');
  await installRoadDriver(page);
  const step = page.getByTestId('road-step');
  const subtitle = page.getByTestId('road-subtitle');
  const left = page.getByTestId('signal-left');
  const right = page.getByTestId('signal-right');

  await expect(step).toHaveText('Bài 1/5 · Xuất phát');
  await expect(subtitle).toContainText('Bắt đầu thi');
  await expect(page.getByTestId('road-distance')).toHaveText('0 / 2000 m');
  await expect(page.getByTestId('road-gap')).toContainText('Xe trước');
  await sim.screenshot('08-road-environment');

  // --- Turn signals: each button toggles, switching sides cancels the other, keys work too.
  await left.click();
  await expect(left).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('signal-lamp-left')).toHaveAttribute('data-on', 'true');
  await right.click();
  await expect(left).toHaveAttribute('aria-pressed', 'false');
  await expect(right).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('signal-lamp-right')).toHaveAttribute('data-on', 'true');
  await page.keyboard.press('Period');
  await expect(right).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Comma');
  await expect(left).toHaveAttribute('aria-pressed', 'true');
  await sim.screenshot('09-road-turn-signal');

  // --- 1. Xuất phát: left signal on, pull away, signal off inside the first 5 m.
  await page.evaluate(async () => {
    const d = window.roadDriver;
    await d.pullAway();
    d.tap('Comma');
  });
  await expect(left).toHaveAttribute('aria-pressed', 'false');
  await expect(info(page, 'Xuất phát đúng quy trình')).toBeVisible();
  expect(await sim.score()).toBe(100);

  // --- 2. Tăng số tăng tốc: above 24 km/h inside the 100 m after the sign.
  await page.evaluate(() => window.roadDriver.drive({ kmh: 18, step: 1 }));
  await expect(step).toHaveText('Bài 2/5 · Tăng số tăng tốc');
  await expect(subtitle).toContainText('Tăng số, tăng tốc');
  await Promise.all([
    expect(info(page, 'Đạt bài tăng số tăng tốc')).toBeVisible({ timeout: 60_000 }),
    page.evaluate(() => window.roadDriver.drive({ kmh: 30, distance: 330 })),
  ]);
  expect(await sim.speed()).toBeGreaterThan(24);
  await sim.screenshot('10-road-traffic');

  // --- 3. Giảm số giảm tốc: under 20 km/h at the checkpoint sign.
  await page.evaluate(() => window.roadDriver.drive({ kmh: 30, step: 2 }));
  await expect(step).toHaveText('Bài 3/5 · Giảm số giảm tốc');
  await Promise.all([
    expect(info(page, 'Đạt bài giảm số giảm tốc')).toBeVisible({ timeout: 90_000 }),
    page.evaluate(async () => {
      const d = window.roadDriver;
      await d.slowTo(15);
      await d.drive({ kmh: 15, distance: 806 });
    }),
  ]);

  // --- 4. Chướng ngại vật: the car in front brakes hard; stop, wait, pull away again.
  await page.evaluate(async () => {
    const d = window.roadDriver;
    await d.drive({ kmh: 30, step: 3 });
    await d.slowTo(0);
  });
  await expect(step).toHaveText('Bài 4/5 · Chướng ngại vật');
  await expect(subtitle).toContainText('phanh gấp');
  await sim.screenshot('11-road-obstacle');
  await page.evaluate(async () => {
    const d = window.roadDriver;
    await d.waitWhileHint('phanh gấp');
    await d.drive({ kmh: 30, step: 4 });
  });

  // --- 5. Kết thúc: right signal, pull over to the shoulder, stop, neutral, handbrake.
  await expect(step).toHaveText('Bài 5/5 · Kết thúc');
  await right.click();
  await expect(right).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(async () => {
    const d = window.roadDriver;
    await d.slowTo(11);
    await d.drive({ kmh: 11, distance: 1960, pulledOver: -1.7, offset: -1.9 });
    await d.slowTo(0, 'N');
    d.tap('Space');
  });

  await expect(page.getByTestId('result-title')).toHaveText('ĐẠT', { timeout: 30_000 });
  await expect(page.getByTestId('result-scenario')).toHaveText('Thi Đường Trường');
  await expect(page.getByTestId('result-modal')).toContainText('Hoàn thành bài thi đường trường');
  await expect(page.getByTestId('result-modal').locator('li')).toHaveCount(0);
  await page.evaluate(() => window.roadDriver.releaseAll());
  await page.waitForTimeout(1500);
  await sim.screenshot('12-road-result');
});
