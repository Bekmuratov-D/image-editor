import { describe, expect, it } from 'vitest';
import { describeColorDepth } from '../src/core/image/describeColorDepth';
import type { RasterImage } from '../src/core/image/RasterImage';

function makeImage(overrides: Partial<RasterImage>): RasterImage {
  return {
    width: 1,
    height: 1,
    pixels: new Uint8ClampedArray(4),
    bitDepth: 8,
    bitsPerPixel: 24,
    hasMask: false,
    isGrayscale: false,
    sourceFormat: 'jpg',
    ...overrides,
  };
}

describe('describeColorDepth', () => {
  it('JPG — 24 бит RGB', () => {
    expect(describeColorDepth(makeImage({}))).toBe('24 бит/пиксель — 8 бит × 3 кан. (RGB)');
  });

  it('PNG с альфой — 32 бит RGBA', () => {
    expect(describeColorDepth(makeImage({ sourceFormat: 'png', bitsPerPixel: 32, hasMask: true }))).toBe(
      '32 бит/пиксель — 8 бит × 4 кан. (RGBA)',
    );
  });

  it('серый PNG с альфой — 16 бит', () => {
    expect(
      describeColorDepth(makeImage({ sourceFormat: 'png', bitsPerPixel: 16, hasMask: true, isGrayscale: true })),
    ).toBe('16 бит/пиксель — 8 бит × 2 кан. (оттенки серого + альфа)');
  });

  it('GB7 с маской и без', () => {
    const gb7 = { sourceFormat: 'gb7' as const, bitDepth: 7, isGrayscale: true };
    expect(describeColorDepth(makeImage({ ...gb7, bitsPerPixel: 7 }))).toBe('7 бит/пиксель — оттенки серого (GB7)');
    expect(describeColorDepth(makeImage({ ...gb7, bitsPerPixel: 8, hasMask: true }))).toBe(
      '8 бит/пиксель — 7 бит серый + 1 бит маска (GB7)',
    );
  });
});
