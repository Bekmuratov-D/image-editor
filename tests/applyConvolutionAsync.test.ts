import { describe, expect, it } from 'vitest';
import { applyConvolutionAsync } from '../src/core/filters/applyConvolutionAsync';
import { applyConvolution3x3 } from '../src/core/filters/convolution';
import { FILTER_PRESETS } from '../src/core/filters/presets';

function makeGradientPixels(width: number, height: number): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const v = Math.round((x / Math.max(1, width - 1)) * 255);
      pixels[o] = v;
      pixels[o + 1] = v;
      pixels[o + 2] = v;
      pixels[o + 3] = 255;
    }
  }
  return pixels;
}

describe('applyConvolutionAsync', () => {
  it('даёт тот же результат что синхронный движок', async () => {
    const pixels = makeGradientPixels(6, 6);
    const sync = applyConvolution3x3(pixels, 6, 6, FILTER_PRESETS.sharpen, ['r', 'g', 'b'], 'clamp');
    const async_ = await applyConvolutionAsync(pixels, 6, 6, FILTER_PRESETS.sharpen, ['r', 'g', 'b'], 'clamp');
    expect(async_).not.toBeNull();
    expect(Array.from(async_ as Uint8ClampedArray)).toEqual(Array.from(sync));
  });

  it('обрабатывает изображение по кускам строк (при маленьком chunkRows)', async () => {
    const pixels = makeGradientPixels(4, 10);
    const sync = applyConvolution3x3(pixels, 4, 10, FILTER_PRESETS.boxBlur, ['r'], 'clamp');
    const async_ = await applyConvolutionAsync(pixels, 4, 10, FILTER_PRESETS.boxBlur, ['r'], 'clamp', {
      chunkRows: 2,
    });
    expect(Array.from(async_ as Uint8ClampedArray)).toEqual(Array.from(sync));
  });

  it('возвращает null при отмене до завершения', async () => {
    const pixels = makeGradientPixels(4, 20);
    let cancelled = false;
    const promise = applyConvolutionAsync(pixels, 4, 20, FILTER_PRESETS.boxBlur, ['r'], 'clamp', {
      chunkRows: 1,
      isCancelled: () => cancelled,
    });
    cancelled = true;
    const result = await promise;
    expect(result).toBeNull();
  });

  it('не мутирует исходный массив', async () => {
    const pixels = makeGradientPixels(4, 4);
    const originalBytes = Array.from(pixels);
    await applyConvolutionAsync(pixels, 4, 4, FILTER_PRESETS.sharpen, ['r', 'g', 'b'], 'clamp');
    expect(Array.from(pixels)).toEqual(originalBytes);
  });
});
