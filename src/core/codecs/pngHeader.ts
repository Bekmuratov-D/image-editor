const IHDR_BIT_DEPTH_OFFSET = 24;
const IHDR_COLOR_TYPE_OFFSET = 25;

export type PngColorType = 0 | 2 | 3 | 4 | 6;

export function readPngColorType(buffer: ArrayBuffer): PngColorType | null {
  if (buffer.byteLength <= IHDR_COLOR_TYPE_OFFSET) {
    return null;
  }
  const value = new DataView(buffer).getUint8(IHDR_COLOR_TYPE_OFFSET);
  return value === 0 || value === 2 || value === 3 || value === 4 || value === 6 ? value : null;
}

// Бит на канал (для палитры — бит на индекс): 1, 2, 4, 8 или 16.
export function readPngBitDepth(buffer: ArrayBuffer): number | null {
  if (buffer.byteLength <= IHDR_BIT_DEPTH_OFFSET) {
    return null;
  }
  const value = new DataView(buffer).getUint8(IHDR_BIT_DEPTH_OFFSET);
  return value === 1 || value === 2 || value === 4 || value === 8 || value === 16 ? value : null;
}

// Бит на канал после раскрытия палитры: записи палитры PNG всегда 8-битные RGB.
export function pngBitsPerChannel(colorType: PngColorType | null, bitDepth: number | null): number {
  if (colorType === 3 || bitDepth === null) {
    return 8;
  }
  return bitDepth;
}

export function isGrayscalePngColorType(colorType: PngColorType | null): boolean {
  return colorType === 0 || colorType === 4;
}

export function hasAlphaPngColorType(colorType: PngColorType | null): boolean {
  return colorType === 4 || colorType === 6;
}
