import type { Histogram } from './computeHistogram';

export type HistogramScale = 'linear' | 'log';

export function scaleBarHeights(histogram: Histogram, scale: HistogramScale): number[] {
  if (scale === 'linear') {
    const max = Math.max(1, ...histogram);
    return histogram.map((count) => count / max);
  }

  const logValues = histogram.map((count) => Math.log(count + 1));
  const max = Math.max(1e-9, ...logValues);
  return logValues.map((value) => value / max);
}
