import { describe, expect, it } from 'vitest';
import { applyConvolution3x3 } from '../src/core/filters/convolution';
import { FILTER_PRESETS } from '../src/core/filters/presets';

function makeGradientPixels(width: number, height: number): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const v = Math.round((x / (width - 1)) * 255);
      pixels[o] = v;
      pixels[o + 1] = v;
      pixels[o + 2] = v;
      pixels[o + 3] = 255;
    }
  }
  return pixels;
}

describe('applyConvolution3x3', () => {
  it('тождественное ядро не меняет картинку', () => {
    const pixels = makeGradientPixels(4, 4);
    const result = applyConvolution3x3(pixels, 4, 4, FILTER_PRESETS.identity, ['r', 'g', 'b'], 'clamp');
    expect(Array.from(result)).toEqual(Array.from(pixels));
  });

  it('не мутирует исходный массив', () => {
    const pixels = makeGradientPixels(4, 4);
    const originalBytes = Array.from(pixels);
    applyConvolution3x3(pixels, 4, 4, FILTER_PRESETS.sharpen, ['r', 'g', 'b'], 'clamp');
    expect(Array.from(pixels)).toEqual(originalBytes);
  });

  it('невыбранные каналы остаются нетронутыми', () => {
    const pixels = new Uint8ClampedArray([10, 20, 30, 128, 40, 50, 60, 200, 70, 80, 90, 64, 100, 110, 120, 32]);
    const result = applyConvolution3x3(pixels, 2, 2, FILTER_PRESETS.sharpen, ['r'], 'clamp');
    // g, b, alpha должны остаться как в оригинале
    for (let i = 0; i < pixels.length; i += 4) {
      expect(result[i + 1]).toBe(pixels[i + 1]);
      expect(result[i + 2]).toBe(pixels[i + 2]);
      expect(result[i + 3]).toBe(pixels[i + 3]);
    }
  });

  it('разные режимы обработки края дают разный результат на границе', () => {
    const pixels = makeGradientPixels(4, 4);
    const black = applyConvolution3x3(pixels, 4, 4, FILTER_PRESETS.boxBlur, ['r'], 'black');
    const white = applyConvolution3x3(pixels, 4, 4, FILTER_PRESETS.boxBlur, ['r'], 'white');
    const clampMode = applyConvolution3x3(pixels, 4, 4, FILTER_PRESETS.boxBlur, ['r'], 'clamp');

    // угловой пиксель (0,0) — граница, три режима должны различаться
    expect(black[0]).not.toBe(white[0]);
    expect(black[0]).not.toBe(clampMode[0]);
  });

  it('размытие (box blur) сглаживает резкий переход', () => {
    const pixels = new Uint8ClampedArray(5 * 1 * 4);
    for (let x = 0; x < 5; x++) {
      const v = x < 2 ? 0 : 255;
      const o = x * 4;
      pixels[o] = v;
      pixels[o + 1] = v;
      pixels[o + 2] = v;
      pixels[o + 3] = 255;
    }
    const result = applyConvolution3x3(pixels, 5, 1, FILTER_PRESETS.boxBlur, ['r'], 'clamp');
    // граница между 0 и 255 (индекс 2) должна стать промежуточным значением
    expect(result[2 * 4]).toBeGreaterThan(0);
    expect(result[2 * 4]).toBeLessThan(255);
  });

  it('оператор Прюитта (Gx) даёт ноль на однородной области', () => {
    const pixels = new Uint8ClampedArray(9 * 4);
    for (let i = 0; i < 9; i++) {
      pixels[i * 4] = 100;
      pixels[i * 4 + 1] = 100;
      pixels[i * 4 + 2] = 100;
      pixels[i * 4 + 3] = 255;
    }
    const result = applyConvolution3x3(pixels, 3, 3, FILTER_PRESETS.prewittGx, ['r'], 'clamp');
    expect(result[4]).toBe(0); // центральный пиксель (1,1), однородная область
  });
});
