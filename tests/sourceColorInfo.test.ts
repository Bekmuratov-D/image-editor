import { describe, expect, it } from 'vitest';
import { readJpegColorInfo, readPngColorInfo } from '../src/core/codecs/sourceColorInfo';
import { readJpegFrameInfo } from '../src/core/codecs/jpegHeader';
import { readPngBitDepth } from '../src/core/codecs/pngHeader';

function buildPngHeader(bitDepth: number, colorType: number) {
  const buffer = new ArrayBuffer(26);
  const view = new DataView(buffer);
  view.setUint8(24, bitDepth);
  view.setUint8(25, colorType);
  return buffer;
}

// SOI, затем APP0 (JFIF, 16 байт) и заголовок кадра SOF0 / SOF2.
function buildJpeg(components: number, { precision = 8, sofMarker = 0xc0 } = {}) {
  const app0 = [0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00];
  const sofLength = 8 + 3 * components;
  const sof = [0xff, sofMarker, 0x00, sofLength, precision, 0x00, 0x10, 0x00, 0x20, components];
  for (let i = 0; i < components; i++) {
    sof.push(i + 1, 0x11, 0x00);
  }
  return new Uint8Array([0xff, 0xd8, ...app0, ...sof, 0xff, 0xd9]).buffer;
}

describe('readPngBitDepth', () => {
  it('читает бит на канал по смещению 24', () => {
    expect(readPngBitDepth(buildPngHeader(16, 2))).toBe(16);
    expect(readPngBitDepth(buildPngHeader(8, 6))).toBe(8);
  });

  it('возвращает null для недопустимого значения', () => {
    expect(readPngBitDepth(buildPngHeader(3, 2))).toBeNull();
  });
});

describe('readPngColorInfo', () => {
  it('PNG RGB без прозрачности — 24 бит, а не 32', () => {
    expect(readPngColorInfo(buildPngHeader(8, 2))).toEqual({ bitDepth: 8, bitsPerPixel: 24, hasMask: false, isGrayscale: false });
  });

  it('PNG RGBA — 32 бит', () => {
    expect(readPngColorInfo(buildPngHeader(8, 6)).bitsPerPixel).toBe(32);
  });

  it('PNG серый — 8 бит, серый с альфой — 16 бит', () => {
    expect(readPngColorInfo(buildPngHeader(8, 0)).bitsPerPixel).toBe(8);
    expect(readPngColorInfo(buildPngHeader(8, 4)).bitsPerPixel).toBe(16);
  });

  it('16-битный PNG RGB — 48 бит', () => {
    expect(readPngColorInfo(buildPngHeader(16, 2))).toMatchObject({ bitDepth: 16, bitsPerPixel: 48 });
  });

  it('палитровый PNG раскрывается в 8-битный RGB — 24 бит', () => {
    expect(readPngColorInfo(buildPngHeader(4, 3))).toMatchObject({ bitDepth: 8, bitsPerPixel: 24, isGrayscale: false });
  });
});

describe('readJpegFrameInfo', () => {
  it('находит SOF после сегмента APP0', () => {
    expect(readJpegFrameInfo(buildJpeg(3))).toEqual({ precision: 8, components: 3 });
  });

  it('понимает прогрессивный JPEG (SOF2)', () => {
    expect(readJpegFrameInfo(buildJpeg(1, { sofMarker: 0xc2 }))).toEqual({ precision: 8, components: 1 });
  });

  it('возвращает null, если это не JPEG', () => {
    expect(readJpegFrameInfo(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer)).toBeNull();
  });
});

describe('readJpegColorInfo', () => {
  it('цветной JPEG — 24 бит RGB без альфы', () => {
    expect(readJpegColorInfo(buildJpeg(3))).toEqual({ bitDepth: 8, bitsPerPixel: 24, hasMask: false, isGrayscale: false });
  });

  it('серый JPEG — 8 бит, оттенки серого', () => {
    expect(readJpegColorInfo(buildJpeg(1))).toEqual({ bitDepth: 8, bitsPerPixel: 8, hasMask: false, isGrayscale: true });
  });

  it('при неразборчивом заголовке — обычный 24-битный RGB', () => {
    expect(readJpegColorInfo(new ArrayBuffer(2)).bitsPerPixel).toBe(24);
  });
});
