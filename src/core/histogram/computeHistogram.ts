import { readChannelValue } from '../channels/extractChannel';

export type HistogramTarget = 'master' | 'r' | 'g' | 'b' | 'alpha';
export type Histogram = number[];

export function computeLumaHistogram(pixels: Uint8ClampedArray): Histogram {
  const histogram = new Array(256).fill(0);
  for (let o = 0; o < pixels.length; o += 4) {
    const luma = Math.round(0.299 * pixels[o] + 0.587 * pixels[o + 1] + 0.114 * pixels[o + 2]);
    histogram[luma]++;
  }
  return histogram;
}

export function computeChannelHistogram(pixels: Uint8ClampedArray, channelId: 'r' | 'g' | 'b' | 'alpha'): Histogram {
  const histogram = new Array(256).fill(0);
  for (let o = 0; o < pixels.length; o += 4) {
    histogram[readChannelValue(pixels, o, channelId)]++;
  }
  return histogram;
}

export function computeHistogramForTarget(pixels: Uint8ClampedArray, target: HistogramTarget): Histogram {
  return target === 'master' ? computeLumaHistogram(pixels) : computeChannelHistogram(pixels, target);
}
