export type SourceFormat = 'png' | 'jpg' | 'gb7';

export interface RasterImage {
  width: number;
  height: number;
  // Всегда RGBA по 8 бит — так данные отдаёт canvas, независимо от формата файла.
  pixels: Uint8ClampedArray;
  // Глубина цвета исходного файла: бит на канал и бит на пиксель (не путать с буфером pixels).
  bitDepth: number;
  bitsPerPixel: number;
  hasMask: boolean;
  isGrayscale: boolean;
  sourceFormat: SourceFormat;
}
