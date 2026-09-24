import { describe, expect, it } from 'vitest';
import { resizePixels } from '../src/core/scaling/resizePixels';

describe('resizePixels', () => {
  it('при одинаковом размере возвращает ту же ссылку на массив (fast path)', () => {
    const pixels = new Uint8ClampedArray([1, 2, 3, 4]);
    const result = resizePixels(pixels, 1, 1, 1, 1, 'nearest');
    expect(result).toBe(pixels);
  });

  it('диспетчеризация по algorithmId работает (nearest vs bilinear дают разный результат на градиенте)', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255]);
    const nearest = resizePixels(data, 2, 1, 4, 1, 'nearest');
    const bilinear = resizePixels(data, 2, 1, 4, 1, 'bilinear');
    expect(Array.from(nearest)).not.toEqual(Array.from(bilinear));
  });

  it('неизвестный algorithmId падает обратно на дефолтный (билинейную)', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255]);
    // @ts-expect-error проверяем поведение на некорректном значении
    const result = resizePixels(data, 2, 1, 4, 1, 'unknown');
    const bilinear = resizePixels(data, 2, 1, 4, 1, 'bilinear');
    expect(Array.from(result)).toEqual(Array.from(bilinear));
  });
});
