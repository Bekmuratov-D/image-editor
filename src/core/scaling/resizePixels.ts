import type { InterpolationId } from './InterpolationAlgorithm';
import { DEFAULT_INTERPOLATION_ID, getInterpolation } from './algorithms';

export function resizePixels(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  algorithmId: InterpolationId = DEFAULT_INTERPOLATION_ID,
): Uint8ClampedArray {
  if (width === targetWidth && height === targetHeight) {
    return pixels;
  }
  return getInterpolation(algorithmId)({ data: pixels, width, height }, targetWidth, targetHeight);
}
