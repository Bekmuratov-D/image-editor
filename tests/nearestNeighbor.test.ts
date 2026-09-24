import { describe, expect, it } from 'vitest';
import { nearestNeighborResample } from '../src/core/scaling/nearestNeighbor';

describe('nearestNeighborResample', () => {
  it('увеличение 2x2 -> 4x4 повторяет каждый исходный пиксель в блоке 2x2', () => {
    const data = new Uint8ClampedArray([
      255, 0, 0, 255,   0, 255, 0, 255,
      0, 0, 255, 255,   255, 255, 0, 255,
    ]);
    const result = nearestNeighborResample({ data, width: 2, height: 2 }, 4, 4);

    const at = (x: number, y: number) => {
      const o = (y * 4 + x) * 4;
      return [result[o], result[o + 1], result[o + 2], result[o + 3]];
    };

    expect(at(0, 0)).toEqual([255, 0, 0, 255]);
    expect(at(1, 0)).toEqual([255, 0, 0, 255]);
    expect(at(2, 0)).toEqual([0, 255, 0, 255]);
    expect(at(0, 2)).toEqual([0, 0, 255, 255]);
    expect(at(2, 2)).toEqual([255, 255, 0, 255]);
  });

  it('тождественный размер не меняет пиксели', () => {
    const data = new Uint8ClampedArray([10, 20, 30, 40, 50, 60, 70, 80]);
    const result = nearestNeighborResample({ data, width: 2, height: 1 }, 2, 1);
    expect(Array.from(result)).toEqual(Array.from(data));
  });
});
