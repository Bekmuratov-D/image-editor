import type { RasterImage } from '../image/RasterImage';
import type { ChannelVisibility } from './channelVisibility';
import { extractChannelAsGrayscale } from './extractChannel';

export function applyChannelVisibility(image: RasterImage, visibility: ChannelVisibility): Uint8ClampedArray {
  const { pixels, isGrayscale, hasMask: hasAlpha } = image;
  const colorOn = isGrayscale ? visibility.gray : visibility.r || visibility.g || visibility.b;
  const alphaOn = hasAlpha && visibility.alpha;

  if (alphaOn && !colorOn) {
    return extractChannelAsGrayscale(image, 'alpha');
  }

  const out = new Uint8ClampedArray(pixels.length);

  for (let o = 0; o < pixels.length; o += 4) {
    if (isGrayscale) {
      const value = visibility.gray ? pixels[o] : 0;
      out[o] = value;
      out[o + 1] = value;
      out[o + 2] = value;
    } else {
      out[o] = visibility.r ? pixels[o] : 0;
      out[o + 1] = visibility.g ? pixels[o + 1] : 0;
      out[o + 2] = visibility.b ? pixels[o + 2] : 0;
    }
    out[o + 3] = alphaOn ? pixels[o + 3] : 255;
  }

  return out;
}
