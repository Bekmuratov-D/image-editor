import { describe, expect, it } from 'vitest';
import { clampZoom, computeAutoFitZoom, MAX_ZOOM, MIN_ZOOM } from '../src/core/zoom/zoomConstraints';

describe('clampZoom', () => {
  it('не даёт выйти за границы 12-300', () => {
    expect(clampZoom(5)).toBe(MIN_ZOOM);
    expect(clampZoom(1000)).toBe(MAX_ZOOM);
    expect(clampZoom(100)).toBe(100);
  });
});

describe('computeAutoFitZoom', () => {
  it('уменьшает большую картинку, чтобы она влезла с отступами', () => {
    const zoom = computeAutoFitZoom(1200, 800, 4000, 3000);
    expect(zoom).toBeLessThan(100);
    expect(zoom).toBeGreaterThanOrEqual(MIN_ZOOM);
  });

  it('увеличивает маленькую картинку, а не оставляет её крошечной', () => {
    const zoom = computeAutoFitZoom(1200, 800, 50, 50);
    expect(zoom).toBeGreaterThan(100);
  });

  it('клэмпит итоговый масштаб до потолка 300%, даже если по формуле выходит больше', () => {
    const zoom = computeAutoFitZoom(1200, 800, 10, 10);
    expect(zoom).toBe(MAX_ZOOM);
  });

  it('не падает при нулевом/отрицательном полезном пространстве', () => {
    expect(computeAutoFitZoom(50, 50, 4000, 3000)).toBe(100);
  });
});
