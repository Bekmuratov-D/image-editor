const IHDR_COLOR_TYPE_OFFSET = 25;

export type PngColorType = 0 | 2 | 3 | 4 | 6;

export function readPngColorType(buffer: ArrayBuffer): PngColorType | null {
  if (buffer.byteLength <= IHDR_COLOR_TYPE_OFFSET) {
    return null;
  }
  const value = new DataView(buffer).getUint8(IHDR_COLOR_TYPE_OFFSET);
  return value === 0 || value === 2 || value === 3 || value === 4 || value === 6 ? value : null;
}

export function isGrayscalePngColorType(colorType: PngColorType | null): boolean {
  return colorType === 0 || colorType === 4;
}

export function hasAlphaPngColorType(colorType: PngColorType | null): boolean {
  return colorType === 4 || colorType === 6;
}
