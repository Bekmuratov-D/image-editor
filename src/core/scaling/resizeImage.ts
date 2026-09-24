import type { RasterImage } from '../image/RasterImage';
import type { InterpolationId } from './InterpolationAlgorithm';
import { DEFAULT_INTERPOLATION_ID } from './algorithms';
import { resizePixels } from './resizePixels';

export function resizeImage(
  image: RasterImage,
  targetWidth: number,
  targetHeight: number,
  algorithmId: InterpolationId = DEFAULT_INTERPOLATION_ID,
): RasterImage {
  return {
    ...image,
    width: targetWidth,
    height: targetHeight,
    pixels: resizePixels(image.pixels, image.width, image.height, targetWidth, targetHeight, algorithmId),
  };
}
