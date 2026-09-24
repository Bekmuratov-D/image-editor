export type InterpolationId = 'nearest' | 'bilinear';

export interface PixelBuffer {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export type InterpolationFn = (source: PixelBuffer, targetWidth: number, targetHeight: number) => Uint8ClampedArray;
