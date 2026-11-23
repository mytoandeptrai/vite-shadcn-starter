import { expect, type Page, test } from '@playwright/test';
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

test('mobile multi-touch: the wheel turns under one finger while another holds the brake', async ({ page }) => {
  const sim = new SimDriver(page);
  await sim.open();
  await sim.start('B1', 'free');
  const fingers = await Fingers.on(page);

  const brake = await fingers.hold('pedal-brake', 0.3);
  await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%|100%/);

  const wheel = await page.getByTestId('steering-wheel').boundingBox();
  if (!wheel) throw new Error('steering wheel not found');
  const cx = wheel.x + wheel.width / 2;
  const cy = wheel.y + wheel.height / 2;
  const r = wheel.width * 0.4;
  const rim = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r] as const;
  };
  const hand = await fingers.touch(...rim(0));
  for (let a = 10; a <= 120; a += 10) await fingers.slide(hand, ...rim(a));
  expect(await sim.steer()).toBeGreaterThan(90);
  // The brake finger never moved: the pedal is still down under it.
  await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%|100%/);

  // Letting go of the wheel centres it; the brake is still held.
  await fingers.lift(hand);
  await sim.waitFor(sim.steer, (v) => Math.abs(v) < 2);
  await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%|100%/);
  await fingers.lift(brake);
  await expect(page.getByTestId('pedal-brake')).toContainText(/^\D*0%/);
});

const PHONES = [
  { name: 'small portrait', width: 360, height: 640 },
  { name: 'portrait', width: 393, height: 851 },
  { name: 'small landscape', width: 667, height: 375 },
  { name: 'landscape', width: 844, height: 390 },
];

type Phone = (typeof PHONES)[number];

const controlIds = (mode: 'B1' | 'B2') => {
  const gears = mode === 'B2' ? ['1', '2', '3', '4', '5', 'R', 'N'] : ['P', 'R', 'N', 'D'];
  const pedals = mode === 'B2' ? ['clutch-slider', 'pedal-brake', 'pedal-throttle'] : ['pedal-brake', 'pedal-throttle'];
  const presets = mode === 'B2' ? ['clutch-floor', 'clutch-bite', 'clutch-up'] : [];
  const ids = [
    'steering-wheel',
    'handbrake',
    'signal-left',
    'signal-right',
    'quick-left',
    'quick-right',
    'engine-start',
    ...gears.map((g) => `gear-${g}`),
    ...pedals,
    ...presets,
  ];
  return { gears, pedals, ids };
};

/** Every target is on screen, at least 40 px, not covered and not overlapping another. */
async function measureTargets(page: Page, phone: Phone, ids: string[], pedals: string[]) {
  const boxes = await page.evaluate(
    (testIds) =>
      testIds.map((id) => {
        const el = document.querySelector(`[data-testid="${id}"]`);
        if (!el) throw new Error(`${id} not found`);
        const r = el.getBoundingClientRect();
        // What a finger at the centre would actually hit.
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { id, left: r.left, top: r.top, right: r.right, bottom: r.bottom, reachable: el.contains(hit) };
      }),
    ids
  );

  for (const box of boxes) {
    const width = box.right - box.left;
    const height = box.bottom - box.top;
    expect(box.reachable, `${box.id} is covered`).toBe(true);
    expect(box.left, box.id).toBeGreaterThanOrEqual(0);
    expect(box.top, box.id).toBeGreaterThanOrEqual(0);
    expect(box.right, box.id).toBeLessThanOrEqual(phone.width);
    expect(box.bottom, box.id).toBeLessThanOrEqual(phone.height);
    // 40 px is the floor for the smallest target; pedals are far larger.
    expect(Math.min(width, height), `${box.id} is ${width}×${height}`).toBeGreaterThanOrEqual(40);
    if (pedals.includes(box.id)) expect(width, `${box.id} width`).toBeGreaterThanOrEqual(48);
  }
  for (const [i, a] of boxes.entries()) {
    for (const b of boxes.slice(i + 1)) {
      const apart = a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top;
      expect(apart, `${a.id} overlaps ${b.id}`).toBe(true);
    }
  }
  return (id: string) => boxes.find((b) => b.id === id) as (typeof boxes)[number];
}

for (const phone of PHONES) {
  for (const mode of ['B1', 'B2'] as const) {
    test(`ergonomics: ${mode} touch targets are thumb-sized and never overlap (${phone.name})`, async ({ page }) => {
      await page.setViewportSize({ width: phone.width, height: phone.height });
      const sim = new SimDriver(page);
      await sim.open();
      await sim.start(mode, 'free');

      const { gears, pedals, ids } = controlIds(mode);
      const box = await measureTargets(page, phone, ids, pedals);

      // Left thumb: wheel, signals, handbrake, gears. Right thumb: pedals.
      expect(box('handbrake').right).toBeLessThan(box('pedal-brake').left);
      expect(box('steering-wheel').right).toBeLessThan(box('pedal-brake').left);
      expect(box(`gear-${gears[0]}`).left).toBeLessThan(phone.width / 2);
      expect(box('pedal-throttle').right).toBeGreaterThan(phone.width - 24);
      await sim.screenshot(`16-ergonomics-${mode}-${phone.width}x${phone.height}`);
    });
  }
}

// The mistakes chip only exists after a penalty in a scored run: check the layout with it on screen.
for (const phone of [PHONES[0], PHONES[2]]) {
  test(`ergonomics: the mistakes chip fits beside the controls after a penalty (${phone.name})`, async ({ page }) => {
    await page.setViewportSize({ width: phone.width, height: phone.height });
    const sim = new SimDriver(page);
    await sim.open();
    await sim.start('B1', 'parking');
    const fingers = await Fingers.on(page);

    // Creep into the parking lane and steer onto a sensor line.
    const brake = await fingers.hold('pedal-brake', 0.3);
    await expect(page.getByTestId('pedal-brake')).toContainText(/[6-9]\d%|100%/);
    await fingers.tap('gear-D');
    await expect(page.getByTestId('hud-gear')).toHaveText('D');
    await fingers.lift(brake);
    await expect(page.getByTestId('hud-hint')).toContainText('ghép xe vào nơi đỗ', { timeout: 30_000 });
    // "Hết lái trái" latches on a tap: the wheel goes to full lock and stays there.
    await fingers.tap('quick-left');
    await sim.waitFor(sim.steer, (v) => v < -180);
    const chip = page.getByTestId('mistakes-open');
    const modal = page.getByTestId('mistakes-modal');
    await expect(page.getByTestId('notice-penalty').last()).toBeVisible({ timeout: 40_000 });
    expect(await sim.steer()).toBeLessThan(-180);

    // The instruction stays above the toast and nothing lies on the controls. Lying down, the phone has
    // no room for a toast and the chip: the toast stands in for the chip while it shows.
    if (phone.height < 500) await expect(chip).toBeHidden();
    else await expect(chip).toBeVisible();
    await expect(page.getByTestId('hud-hint')).toBeVisible();
    const { pedals, ids } = controlIds('B1');
    const toast = await page.evaluate((testIds) => {
      const rect = (el: Element | null) => {
        if (!el) throw new Error('element not found');
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      };
      const toasts = [...document.querySelectorAll('[data-testid="notice-penalty"]')].filter(
        (el) => el.getBoundingClientRect().height > 0
      );
      return {
        shown: toasts.length,
        tip: toasts[0]?.querySelector('[data-testid="notice-tip"]')?.getBoundingClientRect().height,
        toast: rect(toasts[0] ?? null),
        hint: rect(document.querySelector('[data-testid="hud-hint"]')),
        controls: testIds.map((id) => ({ id, ...rect(document.querySelector(`[data-testid="${id}"]`)) })),
      };
    }, ids);
    expect(toast.shown).toBe(1);
    expect(toast.tip).toBe(0);
    expect(toast.toast.bottom - toast.toast.top).toBeGreaterThanOrEqual(40);
    expect(toast.toast.left).toBeGreaterThanOrEqual(0);
    expect(toast.toast.right).toBeLessThanOrEqual(phone.width);
    expect(toast.hint.top).toBeGreaterThanOrEqual(0);
    // The toast slides in from 8 px above its place.
    expect(toast.hint.bottom).toBeLessThanOrEqual(toast.toast.top + 8);
    for (const c of toast.controls) {
      const apart =
        toast.toast.right <= c.left ||
        c.right <= toast.toast.left ||
        toast.toast.bottom <= c.top ||
        c.bottom <= toast.toast.top;
      expect(apart, `the toast covers ${c.id}`).toBe(true);
    }
    await sim.screenshot(`17-mistakes-toast-${phone.width}x${phone.height}`);

    // Tapping the toast opens the list, which pauses the run; the toasts run out behind it.
    const readUnderList = async () => {
      await page.getByTestId('notice-penalty').last().tap();
      await expect(modal).toBeVisible({ timeout: 3000 });
      await expect(page.getByTestId('notice-penalty')).toHaveCount(0, { timeout: 15_000 });
    };
    await readUnderList();
    const resume = await measureTargets(page, phone, ['mistakes-close', 'mistakes-resume'], []);
    expect(resume('mistakes-resume').bottom).toBeLessThanOrEqual(phone.height);
    await fingers.tap('mistakes-resume');
    await expect(modal).toHaveCount(0);

    // Leave the car standing, so it cannot wander into a kerb.
    const stop = await fingers.hold('pedal-brake', 0.3);
    await sim.waitFor(sim.speed, (v) => v < 0.5);
    await fingers.tap('gear-N');
    await expect(page.getByTestId('hud-gear')).toHaveText('N');
    await fingers.lift(stop);

    // With the toast gone the chip is back, beside the controls and under a thumb. A car standing on
    // a sensor line is penalised again every 5 s, so another toast may take the chip's place first:
    // read that one under the list as well and look again.
    await expect(async () => {
      if (await modal.isVisible()) await fingers.tap('mistakes-resume');
      if (await chip.isHidden()) {
        await readUnderList();
        await fingers.tap('mistakes-resume');
      }
      const box = await measureTargets(page, phone, [...ids, 'mistakes-open'], pedals);
      expect(box('mistakes-open').bottom).toBeLessThanOrEqual(box('steering-wheel').top);
      await fingers.tap('mistakes-open');
      await expect(modal).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 60_000 });
    await fingers.tap('mistakes-resume');
    await expect(modal).toHaveCount(0);
    await expect(page.locator('.ds-root')).toHaveAttribute('data-phase', 'driving');
  });
}

// In the road test the panel carries the examiner's instruction, the distance left and the gap to the
// car ahead: they must stay readable while a penalty toast shows and after it, even where there is
// room for two lines only, and nothing may lie on the controls or the map.
const ROAD_PHONES = [
  PHONES[0],
  PHONES[2],
  PHONES[1],
  // Just tall enough for the map, which leaves the hints the least room beside it.
  { name: 'short portrait with map', width: 400, height: 780 },
];

/** Where the hint lines, the map and the controls are, and whether the gap to the car ahead is shown. */
const roadLayout = (page: Page, ids: string[]) =>
  page.evaluate((testIds) => {
    type Box = { left: number; top: number; right: number; bottom: number };
    const box = (el: Element | null | undefined): Box | null => {
      const r = el?.getBoundingClientRect();
      return r && r.height > 0 ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : null;
    };
    const one = (id: string) => box(document.querySelector(`[data-testid="${id}"]`));
    const toasts = [...document.querySelectorAll('[data-testid="notice-penalty"]')].map(box).filter((b) => b !== null);
    return {
      gap: document.querySelector('[data-testid="road-widget"]')?.getAttribute('data-gap') ?? '',
      gapShown: one('road-gap') ?? one('road-gap-inline'),
      distanceShown: one('road-distance'),
      hint: one('hud-hint'),
      panel: one('road-widget'),
      toast: toasts.at(-1) ?? null,
      chip: one('mistakes-open'),
      map: one('minimap'),
      controls: testIds.map((id) => ({ id, box: one(id) })),
    };
  }, ids);

for (const phone of ROAD_PHONES) {
  test(`road test: the instruction stays on screen under a penalty toast (${phone.name})`, async ({ page }) => {
    await page.setViewportSize({ width: phone.width, height: phone.height });
    const sim = new SimDriver(page);
    await sim.open();
    await sim.start('B2', 'road');
    const hint = page.getByTestId('hud-hint');
    await expect(page.getByTestId('road-step')).toBeVisible();

    const { ids, pedals } = controlIds('B2');
    type Layout = Awaited<ReturnType<typeof roadLayout>>;
    type Box = NonNullable<Layout['hint']>;
    const apart = (a: Box, b: Box) => a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top;
    const check = (layout: Layout, state: string) => {
      expect(layout.hint, `${state}: no instruction`).not.toBeNull();
      // A car is parked ahead of the start: the distance to it is on screen in one form or another.
      expect(layout.gap, `${state}: no car ahead`).not.toBe('');
      expect(layout.gapShown, `${state}: the gap to the car ahead is hidden`).not.toBeNull();
      expect(layout.map !== null, `${state}: map`).toBe(phone.height > 760);
      const lines = [layout.panel, layout.toast, layout.chip].filter((b) => b !== null);
      for (const line of lines) {
        expect(line.left, state).toBeGreaterThanOrEqual(0);
        expect(line.right, state).toBeLessThanOrEqual(phone.width);
        expect(line.top, state).toBeGreaterThanOrEqual(0);
        if (layout.map) expect(apart(line, layout.map), `${state}: a hint line lies on the map`).toBe(true);
        for (const c of layout.controls) {
          if (!c.box) throw new Error(`${c.id} not found`);
          expect(apart(line, c.box), `${state}: a hint line covers ${c.id}`).toBe(true);
          expect(c.box.top, c.id).toBeGreaterThanOrEqual(0);
          expect(c.box.bottom, c.id).toBeLessThanOrEqual(phone.height);
        }
      }
    };

    // Pulling away without the left signal costs 5 points as soon as the car rolls.
    await sim.engage('1');
    await page.keyboard.press('Space');
    await sim.pullAway();
    await expect(page.getByTestId('notice-penalty').last()).toBeVisible({ timeout: 40_000 });
    await page.keyboard.up('KeyW');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/còn \d+ m/);

    const busy = await roadLayout(page, ids);
    expect(busy.toast, 'no toast').not.toBeNull();
    check(busy, 'toast');
    // The toast slides in from 8 px above its place, under the instruction.
    expect(busy.hint?.bottom, 'the toast covers the instruction').toBeLessThanOrEqual((busy.toast?.top ?? 0) + 8);
    await sim.screenshot(`18-road-toast-${phone.width}x${phone.height}`);

    // Once the toast is gone the chip is there, with the instruction and the gap still above it.
    await expect(page.getByTestId('mistakes-open')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('notice-penalty')).toHaveCount(0, { timeout: 15_000 });
    await expect(hint).toBeVisible();
    const marked = await roadLayout(page, ids);
    expect(marked.chip, 'no chip').not.toBeNull();
    check(marked, 'chip');
    // All but the smallest phone keep the header with the distance driven.
    if (phone !== PHONES[0]) expect(marked.distanceShown, 'the header is hidden').not.toBeNull();
    await measureTargets(page, phone, [...ids, 'mistakes-open'], pedals);
    await sim.screenshot(`18-road-chip-${phone.width}x${phone.height}`);
  });
}
