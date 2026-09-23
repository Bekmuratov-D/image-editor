import { describe, expect, it } from 'vitest';
import { hasAlphaPngColorType, isGrayscalePngColorType, readPngColorType } from '../src/core/codecs/pngHeader';

function buildPngHeader(colorType: number) {
  const buffer = new ArrayBuffer(26);
  const view = new DataView(buffer);
  view.setUint8(25, colorType);
  return buffer;
}

describe('readPngColorType', () => {
  it('читает байт color type по смещению 25', () => {
    expect(readPngColorType(buildPngHeader(6))).toBe(6);
    expect(readPngColorType(buildPngHeader(0))).toBe(0);
  });

  it('возвращает null для слишком короткого буфера', () => {
    expect(readPngColorType(new ArrayBuffer(10))).toBeNull();
  });

  it('возвращает null для неизвестного значения color type', () => {
    expect(readPngColorType(buildPngHeader(99))).toBeNull();
  });
});

describe('isGrayscalePngColorType / hasAlphaPngColorType', () => {
  it('0 (grayscale) — ч/б без альфы', () => {
    expect(isGrayscalePngColorType(0)).toBe(true);
    expect(hasAlphaPngColorType(0)).toBe(false);
  });

  it('2 (truecolor) — RGB без альфы', () => {
    expect(isGrayscalePngColorType(2)).toBe(false);
    expect(hasAlphaPngColorType(2)).toBe(false);
  });

  it('4 (grayscale+alpha) — ч/б с альфой', () => {
    expect(isGrayscalePngColorType(4)).toBe(true);
    expect(hasAlphaPngColorType(4)).toBe(true);
  });

  it('6 (truecolor+alpha) — RGB с альфой', () => {
    expect(isGrayscalePngColorType(6)).toBe(false);
    expect(hasAlphaPngColorType(6)).toBe(true);
  });
});
