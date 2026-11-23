import { describe, expect, it } from 'vitest';
import { HILL, PARKING, PARKING_BAY, SPAWNS, TRACK_LINES } from '../constants';
import { KERB, kerbBlocks, onPavement, offsetPath, roundPath } from './yard';
import { MARKS } from './yard-marks';

describe('yard geometry', () => {
  it('rounds a corner into an arc that stays `r` from the arc centre', () => {
    const path = roundPath(
      [
        { x: 0, z: 0 },
        { x: 10, z: 0, r: 2 },
        { x: 10, z: 10 },
      ],
      false
    );
    expect(path[0]).toEqual({ x: 0, z: 0 });
    expect(path.at(-1)).toEqual({ x: 10, z: 10 });
    for (const p of path.slice(1, -1)) expect(Math.hypot(p.x - 8, p.z - 2)).toBeCloseTo(2, 5);
  });

  it('offsets a path to its left', () => {
    const [a, b] = offsetPath(
      [
        { x: 0, z: 0 },
        { x: 0, z: 5 },
      ],
      1,
      false
    );
    // Heading +Z, left is +X.
    expect(a).toEqual({ x: 1, z: 0 });
    expect(b).toEqual({ x: 1, z: 5 });
  });

  it('starts every sa hình scenario on the road', () => {
    for (const scenario of ['free', 'hill', 'parking'] as const) {
      expect(onPavement(SPAWNS[scenario]), scenario).toBe(true);
    }
  });

  it('paves the slope, the parking lane and the bay, and leaves the islands as grass', () => {
    for (const z of [HILL.rampStartZ, HILL.stopLineZ, HILL.finishZ]) {
      expect(onPavement({ x: HILL.centerX - HILL.width / 2 + 0.2, z })).toBe(true);
      expect(onPavement({ x: HILL.centerX + HILL.width / 2 - 0.2, z })).toBe(true);
    }
    expect(onPavement({ x: PARKING.bayCenterX, z: (PARKING_BAY.minZ + PARKING_BAY.maxZ) / 2 })).toBe(true);
    expect(onPavement({ x: PARKING.bayCenterX, z: PARKING_BAY.minZ - 1 })).toBe(false);
    expect(onPavement({ x: 30, z: -40 })).toBe(false);
    expect(onPavement({ x: -80, z: 0 })).toBe(false);
  });

  it('keeps every scored line on the asphalt, clear of the kerb', () => {
    for (const line of TRACK_LINES) {
      for (const p of [line.a, line.b]) expect(onPavement(p), line.id).toBe(true);
    }
  });

  it('lays kerb blocks only along the outside edge of the asphalt', () => {
    const blocks = kerbBlocks();
    expect(blocks.length).toBeGreaterThan(1500);
    for (const { a, b, out } of blocks) {
      const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
      expect(onPavement({ x: mid.x + out.x * KERB.width * 0.9, z: mid.z + out.z * KERB.width * 0.9 })).toBe(false);
      expect(onPavement({ x: mid.x - out.x * 0.06, z: mid.z - out.z * 0.06 })).toBe(true);
    }
  });

  it('ends every kerb block where the road beside it ends, not across the mouth of a junction', () => {
    for (const { a, b, out } of kerbBlocks()) {
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      // Just inside each end, the strip the kerb stands on is still off the asphalt.
      for (const t of [0.06 / len, 1 - 0.06 / len]) {
        const p = { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
        expect(
          onPavement({ x: p.x + out.x * 0.06, z: p.z + out.z * 0.06 }),
          `${p.x.toFixed(2)}, ${p.z.toFixed(2)}`
        ).toBe(false);
      }
    }
  });

  it('paints every marking on the asphalt', () => {
    for (const { a, b } of MARKS) {
      expect(onPavement({ x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 })).toBe(true);
    }
  });
});
