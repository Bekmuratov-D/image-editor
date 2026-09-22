export type SourceFormat = 'png' | 'jpg' | 'gb7';

export interface RasterImage {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  bitDepth: number;
  hasMask: boolean;
  sourceFormat: SourceFormat;
}
