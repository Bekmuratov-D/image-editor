import { describe, expect, it } from 'vitest';
import { scaleBarHeights } from '../src/core/histogram/scaleHistogramBars';

describe('scaleBarHeights', () => {
  it('линейный режим: максимум -> 1, остальные пропорционально', () => {
    const histogram = new Array(256).fill(0);
    histogram[10] = 50;
    histogram[20] = 100;

    const heights = scaleBarHeights(histogram, 'linear');
    expect(heights[20]).toBe(1);
    expect(heights[10]).toBeCloseTo(0.5, 5);
    expect(heights[0]).toBe(0);
  });

  it('не падает на пустой гистограмме', () => {
    const histogram = new Array(256).fill(0);
    const heights = scaleBarHeights(histogram, 'linear');
    expect(heights.every((h) => h === 0)).toBe(true);
  });

  it('логарифмический режим: максимум -> 1, log(0+1)=0 остаётся 0', () => {
    const histogram = new Array(256).fill(0);
    histogram[5] = 1000;

    const heights = scaleBarHeights(histogram, 'log');
    expect(heights[5]).toBeCloseTo(1, 5);
    expect(heights[0]).toBe(0);
  });
});
