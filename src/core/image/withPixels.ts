import type { RasterImage } from './RasterImage';

export function withPixels(image: RasterImage, pixels: Uint8ClampedArray): RasterImage {
  return { ...image, pixels };
}
