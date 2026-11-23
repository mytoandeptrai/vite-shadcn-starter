import type { Page } from '@playwright/test';

interface RoadDriver {
  /** B1: brake, select D, release the handbrake and let the car creep off the line. */
  pullAway(): Promise<void>;
  /** Press and release a key. */
  tap(code: string): void;
  /** Hold `kmh` in the lane (or `offset` metres left of its centre) until one of the stop conditions. */
  drive(options: {
    kmh: number;
    /** Stop conditions: metres driven, test step reached, speed reached. */
    distance?: number;
    step?: number;
    reach?: number;
    /** Stop once the car is at least this far right of the lane centre (negative metres) and running straight. */
    pulledOver?: number;
    offset?: number;
    /** Fastest sideways move towards `offset`, in m/s. */
    drift?: number;
  }): Promise<void>;
  /** Brake to `kmh`, steering as in the last `drive`; 0 is a full stop with the brake kept on, optionally selecting `gear` once stopped. */
  slowTo(kmh: number, gear?: 'N' | 'P'): Promise<void>;
  /** Stay stopped until the hint no longer contains `text`. */
  waitWhileHint(text: string): Promise<void>;
  releaseAll(): void;
}

declare global {
  interface Window {
    roadDriver: RoadDriver;
  }
}

/**
 * Installs a learner that drives the road test in an automatic from inside the page: it reads the HUD and
 * works the keys and the steering wheel as a person would, one decision per rendered frame, so a slow headless
 * frame rate or the Playwright round trip cannot make it miss a braking point.
 */
export async function installRoadDriver(page: Page) {
  await page.evaluate(() => {
    const held = new Set<string>();
    const key = (type: 'keydown' | 'keyup', code: string) =>
      window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true, cancelable: true }));
    const hold = (code: string, on: boolean) => {
      if (on === held.has(code)) return;
      if (on) held.add(code);
      else held.delete(code);
      key(on ? 'keydown' : 'keyup', code);
    };
    const press = (code: string) => {
      key('keydown', code);
      key('keyup', code);
    };
    const text = (id: string) => document.querySelector(`[data-testid=${id}]`)?.textContent ?? '';
    const read = () => {
      const data = document.querySelector<HTMLElement>('[data-testid=road-widget]')?.dataset;
      return {
        speed: Number.parseFloat(text('hud-speed')),
        brake: Number.parseFloat(text('pedal-brake').replace(/\D+/g, ' ')),
        gear: text('hud-gear'),
        distance: Number(data?.distance ?? 0),
        offset: Number(data?.offset ?? 0),
        gap: data?.gap ? Number(data.gap) : null,
        step: Number(data?.step ?? 0),
        over: document.querySelector('.ds-root')?.getAttribute('data-phase') !== 'driving',
      };
    };
    const until = (done: () => boolean, tick?: () => void) =>
      new Promise<void>((resolve) => {
        const loop = () => {
          if (done() || read().over) return resolve();
          tick?.();
          requestAnimationFrame(loop);
        };
        loop();
      });

    // The headless scene renders only a few frames per second and the HUD lags the car a little,
    // so the driver looks ahead: it acts on where the speed will be.
    let speedSample = { speed: 0, at: performance.now(), rate: 0 };
    const speedSoon = (seconds: number) => {
      const { speed } = read();
      const now = performance.now();
      if (speed !== speedSample.speed) {
        const rate = (speed - speedSample.speed) / Math.max(0.05, (now - speedSample.at) / 1000);
        speedSample = { speed, at: now, rate };
      }
      return speed + (now - speedSample.at > 500 ? 0 : speedSample.rate) * seconds;
    };

    // Steering: the on-screen wheel is dragged to an exact angle. Unlike a key held for one frame,
    // that turns the car by the same amount however slowly the headless scene renders.
    let grip: { at: number; deg: number } | null = null;
    const wheelEvent = (type: string, at: number) => {
      const wheel = document.querySelector<HTMLElement>('[data-testid=steering-wheel]');
      if (!wheel) return;
      const box = wheel.getBoundingClientRect();
      const radius = box.width * 0.4;
      wheel.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          pointerType: 'mouse',
          isPrimary: true,
          buttons: type === 'pointerup' ? 0 : 1,
          clientX: box.left + box.width / 2 + radius * Math.cos(at),
          clientY: box.top + box.height / 2 + radius * Math.sin(at),
        })
      );
    };
    const turnTo = (deg: number) => {
      if (!grip) {
        grip = { at: -Math.PI / 2, deg: Number.parseFloat(text('steer-angle')) || 0 };
        wheelEvent('pointerdown', grip.at);
      }
      // The wheel reads a move of more than half a turn as one the other way round.
      while (deg !== grip.deg) {
        const move = Math.max(-90, Math.min(90, deg - grip.deg));
        grip.at += (move * Math.PI) / 180;
        grip.deg += move;
        wheelEvent('pointermove', grip.at);
      }
    };
    const letGo = () => {
      if (grip) wheelEvent('pointerup', grip.at);
      grip = null;
    };

    // Lane keeping: aim for a sideways speed proportional to the offset error, and turn the wheel
    // to the angle that closes the gap to that sideways speed in about RESPONSE seconds.
    const WHEELBASE = 2.6;
    const WHEEL_DEG_PER_ROAD_RAD = (540 / 35) * (180 / Math.PI);
    const RESPONSE = 1.2;
    const MAX_WHEEL = 90;
    let lane = { offset: 0, drift: 0.4 };
    let sample = { offset: 0, at: performance.now(), drift: 0 };
    /** Sideways speed in m/s; an offset that has not changed for a while means the car runs straight. */
    const sideways = () => (performance.now() - sample.at > 500 ? 0 : sample.drift);
    const steer = () => {
      const { offset, speed } = read();
      const now = performance.now();
      if (offset !== sample.offset) {
        const drift = (offset - sample.offset) / Math.max(0.05, (now - sample.at) / 1000);
        sample = { offset, at: now, drift: (sideways() + drift) / 2 };
      }
      const v = speed / 3.6;
      if (v < 0.5) return turnTo(0);
      const wanted = Math.max(-lane.drift, Math.min(lane.drift, (lane.offset - offset) * 0.3));
      // Sideways acceleration is v² / wheelbase × road-wheel angle; left is a negative wheel angle.
      const road = ((wanted - sideways()) / RESPONSE) * (WHEELBASE / (v * v));
      turnTo(Math.round(Math.max(-MAX_WHEEL, Math.min(MAX_WHEEL, -road * WHEEL_DEG_PER_ROAD_RAD))));
    };
    // Speed keeping, easing off when closing on the car in front.
    const pace = (kmh: number) => {
      const { gap } = read();
      const soon = speedSoon(0.3);
      const limit = gap !== null && gap < 30 ? Math.max(0, Math.min(kmh, (gap - 12) * 1.5)) : kmh;
      hold('KeyW', soon < limit - 0.5);
      hold('KeyS', soon > limit + 4);
    };

    window.roadDriver = {
      async pullAway() {
        hold('KeyS', true);
        await until(() => read().brake > 50);
        press('KeyF');
        await until(() => read().gear === 'D');
        press('Space');
        hold('KeyS', false);
        await until(() => read().speed > 1.5);
      },
      tap: press,
      async drive({ kmh, distance = Number.POSITIVE_INFINITY, step, reach, pulledOver, offset = 0, drift = 0.4 }) {
        lane = { offset, drift };
        await until(
          () => {
            const now = read();
            if (now.distance >= distance) return true;
            if (step !== undefined && now.step >= step) return true;
            // Still heading for the kerb would carry the car into it while it brakes.
            if (pulledOver !== undefined && now.offset <= pulledOver && Math.abs(sideways()) < 0.1) return true;
            return reach !== undefined && now.speed >= reach;
          },
          () => {
            pace(kmh);
            steer();
          }
        );
        // Nothing stays pressed between calls: the test may spend seconds on a screenshot.
        for (const code of ['KeyW', 'KeyS']) hold(code, false);
        letGo();
      },
      async slowTo(kmh, gear) {
        hold('KeyW', false);
        // Come off the brake early: the car keeps slowing while the pedal travels back up.
        await until(
          () => (kmh > 0 ? speedSoon(0.45) <= kmh + 1 : read().speed <= 0.05),
          () => {
            hold('KeyS', true);
            steer();
          }
        );
        letGo();
        if (kmh > 0) hold('KeyS', false);
        if (gear) {
          press(`Key${gear}`);
          await until(() => read().gear === gear);
        }
      },
      async waitWhileHint(part) {
        await until(() => !text('hud-hint').includes(part));
      },
      releaseAll() {
        letGo();
        for (const code of [...held]) hold(code, false);
      },
    };
  });
}
