import { describe, expect, it } from 'vitest';
import { bilinearResample } from '../src/core/scaling/bilinear';

describe('bilinearResample', () => {
  it('тождественный размер не меняет пиксели', () => {
    const data = new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 255]);
    const result = bilinearResample({ data, width: 2, height: 1 }, 2, 1);
    expect(Array.from(result)).toEqual(Array.from(data));
  });

  it('интерполирует значение между двумя пикселями по горизонтали', () => {
    // 2x1: чёрный (0) слева, белый (255) справа. Увеличиваем до 4x1 -> средние
    // точки должны получить промежуточные значения, а не резкую границу.
    const data = new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255]);
    const result = bilinearResample({ data, width: 2, height: 1 }, 4, 1);

    const at = (x: number) => result[x * 4];

    expect(at(0)).toBeGreaterThanOrEqual(0);
    expect(at(3)).toBeLessThanOrEqual(255);
    // где-то в середине должно быть промежуточное значение, не 0 и не 255
    const middleValues = [at(1), at(2)];
    expect(middleValues.some((v) => v > 0 && v < 255)).toBe(true);
  });

  it('усредняет 4 угла для центральной точки при уменьшении 2x2 -> 1x1', () => {
    const data = new Uint8ClampedArray([
      0, 0, 0, 255, 100, 100, 100, 255, 200, 200, 200, 255, 255, 255, 255, 255,
    ]);
    const result = bilinearResample({ data, width: 2, height: 2 }, 1, 1);
    // среднее из 0,100,200,255 = 138.75
    expect(result[0]).toBeGreaterThan(100);
    expect(result[0]).toBeLessThan(180);
  });

  it('не выходит за границы изображения (clamp по краям)', () => {
    const data = new Uint8ClampedArray([50, 50, 50, 255, 200, 200, 200, 255]);
    const result = bilinearResample({ data, width: 2, height: 1 }, 8, 1);
    for (let i = 0; i < result.length; i += 4) {
      expect(result[i]).toBeGreaterThanOrEqual(0);
      expect(result[i]).toBeLessThanOrEqual(255);
    }
  });
});
