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

test('holding or repeating driving keys never leaves the simulator', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open();
  await sim.start('B2', 'free');
  const k = page.keyboard;
  // Key repeat and quick double taps of every driving key.
  for (const code of ['KeyS', 'KeyD', 'KeyW', 'KeyA', 'KeyC', 'KeyX', 'KeyQ', 'KeyE', 'KeyM', 'KeyV']) {
    for (let i = 0; i < 6; i++) await k.down(code);
    await k.up(code);
    await k.press(code);
    await k.press(code);
  }
  for (const code of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyT', 'KeyB', 'KeyP']) await k.press(code);
  expect(new URL(page.url()).pathname).toBe('/');
  await expect(page.getByTestId('hud')).toBeVisible();

  // A focused HUD button must not be clicked by Space (handbrake) or Enter (engine start).
  await page.getByTestId('camera-toggle').click();
  const camera = await page.getByTestId('camera-toggle').textContent();
  await k.press('Space');
  await k.press('Enter');
  await expect(page.getByTestId('camera-toggle')).toHaveText(camera ?? '');
});

test('usage guide: opens from the menu and while driving, pauses the car, explains each exercise', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open();

  await page.getByTestId('guide-button').click();
  await expect(page.getByTestId('guide-modal')).toBeVisible();
  await page.getByTestId('guide-tab-hill').click();
  await expect(page.getByTestId('guide-panel')).toContainText('nhả phanh tay');
  await sim.screenshot('06-guide');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('guide-modal')).toBeHidden();
  await expect(page.getByTestId('start-button')).toBeVisible();

  // B1 creeping in D: the guide freezes the car and ignores the driving keys.
  await sim.start('B1', 'parking');
  await expect(page.getByTestId('hud-coach')).toContainText('Giữ phanh');
  await page.keyboard.down('KeyS');
  await page.waitForTimeout(600);
  await page.keyboard.press('KeyF');
  await expect(page.getByTestId('hud-coach')).toContainText('xe tự bò');
  await page.keyboard.up('KeyS');
  await expect(page.getByTestId('hud-hint')).toContainText('ghép xe vào nơi đỗ', { timeout: 30_000 });

  await page.keyboard.press('KeyH');
  await expect(page.getByTestId('guide-panel')).toContainText('Hết lái phải');
  const clock = await page.getByTestId('hud-clock').textContent();
  await page.keyboard.press('KeyN');
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1500);
  await page.keyboard.up('KeyW');
  await expect(page.getByTestId('hud-clock')).toHaveText(clock ?? '');
  await expect(page.getByTestId('hud-gear')).toHaveText('D');

  await page.getByTestId('guide-close').click();
  await expect(page.getByTestId('guide-modal')).toBeHidden();
  await expect(page.getByTestId('hud-clock')).not.toHaveText(clock ?? '', { timeout: 10_000 });
  expect(await sim.speed()).toBeGreaterThan(1);

  await page.getByTestId('guide-open').click();
  await expect(page.getByTestId('guide-modal')).toBeVisible();
  await page.keyboard.press('KeyH');
  await expect(page.getByTestId('guide-modal')).toBeHidden();
});

test('SEO: the served page carries the jacobhocoto brand, share card, structured data and crawler files', async ({
  page,
  request,
}) => {
  // What a crawler that does not run scripts receives.
  const html = await (await request.get('/')).text();
  expect(html).toContain('<html lang="vi">');
  expect(html).toMatch(/<title>jacobhocoto – [^<]+<\/title>/);
  expect(html).toContain('<h1>Mô phỏng thi sa hình lái xe B1/B2 3D</h1>');
  expect(html).not.toContain('noindex');
  const origin = html.match(/<link rel="canonical" href="(https:\/\/[^"]+)\/">/)?.[1];
  expect(origin).toBeTruthy();
  expect(html).toContain(`<meta property="og:image" content="${origin}/og-image.jpg">`);
  expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
  const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)?.[1] ?? '');
  expect(jsonLd['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual(['WebSite', 'WebApplication']);

  // Every file the head points at exists and has the right type.
  for (const [path, type] of [
    ['/og-image.jpg', 'image/jpeg'],
    ['/favicon.ico', 'image/'],
    ['/favicon.svg', 'image/svg+xml'],
    ['/logo.svg', 'image/svg+xml'],
    ['/icons/apple-touch-icon.png', 'image/png'],
    ['/icons/icon-192.png', 'image/png'],
    ['/icons/icon-512.png', 'image/png'],
    ['/icons/icon-maskable-512.png', 'image/png'],
    ['/manifest.webmanifest', 'application/manifest+json'],
    ['/robots.txt', 'text/plain'],
    ['/sitemap.xml', '/xml'],
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).toContain(type);
  }
  expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${origin}/sitemap.xml`);
  expect(await (await request.get('/sitemap.xml')).text()).toContain(`<loc>${origin}/</loc>`);
  expect((await (await request.get('/manifest.webmanifest')).json()).short_name).toBe('jacobhocoto');

  // Once the app runs: the title is kept, the static shell is replaced and the brand is on screen.
  const sim = new SimDriver(page);
  await sim.open();
  await expect(page).toHaveTitle(/^jacobhocoto – /);
  await expect(page.locator('.seo-shell')).toHaveCount(0);
  await expect(page.getByTestId('scenario-modal').getByAltText('jacobhocoto')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index, follow/);

  // Unknown URLs are answered by the SPA fallback, so they must opt out of indexing.
  await page.goto('/khong-ton-tai');
  await expect(page).toHaveTitle('404 · jacobhocoto');
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');

  // The dark backdrop belongs to the static shell only: themed pages keep their own background.
  const colours = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.background = 'var(--background)';
    document.body.append(probe);
    const theme = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return { theme, body: getComputedStyle(document.body).backgroundColor };
  });
  expect(colours.body).toBe(colours.theme);
});

test('buy me a coffee: the button on the main screen opens the QR dialog, which closes again', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open();
  const dialog = page.getByTestId('donate-dialog');
  await page.getByTestId('donate-button').click();
  await expect(dialog).toBeVisible();
  const qr = dialog.getByRole('img');
  await expect(qr).toHaveAttribute('alt', /TRAN PHUOC MY TOAN.*9941 2759 46/);
  await expect.poll(() => qr.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBe(720);
  const box = await dialog.boundingBox();
  expect(box && box.y >= 0 && box.y + box.height <= 800).toBe(true);
  await sim.screenshot('13-buy-me-a-coffee');

  // Escape closes only the dialog; the simulator's own shortcuts stay out of it.
  await page.keyboard.press('KeyH');
  await expect(page.getByTestId('guide-modal')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId('scenario-modal')).toBeVisible();

  await page.getByTestId('donate-button').click();
  await page.getByTestId('donate-close').click();
  await expect(dialog).toBeHidden();
  await page.getByTestId('donate-button').click();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});
