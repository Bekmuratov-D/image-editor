import { describe, expect, it } from 'vitest';
import { computeChannelHistogram, computeHistogramForTarget, computeLumaHistogram } from '../src/core/histogram/computeHistogram';

function makePixels(...pixels: [number, number, number, number][]): Uint8ClampedArray {
  return new Uint8ClampedArray(pixels.flat());
}

describe('computeLumaHistogram', () => {
  it('считает светлоту по формуле 0.299R+0.587G+0.114B', () => {
    const pixels = makePixels([255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255]);
    const histogram = computeLumaHistogram(pixels);

    expect(histogram[Math.round(0.299 * 255)]).toBeGreaterThanOrEqual(1);
    expect(histogram[Math.round(0.587 * 255)]).toBeGreaterThanOrEqual(1);
    expect(histogram[Math.round(0.114 * 255)]).toBeGreaterThanOrEqual(1);
  });

  it('сумма по всем корзинам равна количеству пикселей', () => {
    const pixels = makePixels([10, 20, 30, 255], [40, 50, 60, 255], [10, 20, 30, 255]);
    const histogram = computeLumaHistogram(pixels);
    expect(histogram.reduce((a, b) => a + b, 0)).toBe(3);
  });
});

describe('computeChannelHistogram', () => {
  it('считает сырые значения конкретного канала', () => {
    const pixels = makePixels([10, 20, 30, 128], [10, 200, 30, 64]);
    const histogram = computeChannelHistogram(pixels, 'g');

    expect(histogram[20]).toBe(1);
    expect(histogram[200]).toBe(1);
    expect(histogram.reduce((a, b) => a + b, 0)).toBe(2);
  });

  it('альфа-канал считается отдельно от цвета', () => {
    const pixels = makePixels([10, 10, 10, 5], [10, 10, 10, 250]);
    const histogram = computeChannelHistogram(pixels, 'alpha');
    expect(histogram[5]).toBe(1);
    expect(histogram[250]).toBe(1);
  });
});

describe('computeHistogramForTarget', () => {
  it('master -> luma, конкретный канал -> сырые значения', () => {
    const pixels = makePixels([100, 150, 200, 255]);
    expect(computeHistogramForTarget(pixels, 'master')).toEqual(computeLumaHistogram(pixels));
    expect(computeHistogramForTarget(pixels, 'r')).toEqual(computeChannelHistogram(pixels, 'r'));
  });
});
