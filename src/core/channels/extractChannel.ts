import type { RasterImage } from '../image/RasterImage';
import type { ChannelId } from './channelProfile';

function readChannelValue(pixels: Uint8ClampedArray, pixelOffset: number, channelId: ChannelId): number {
  switch (channelId) {
    case 'gray':
    case 'r':
      return pixels[pixelOffset];
    case 'g':
      return pixels[pixelOffset + 1];
    case 'b':
      return pixels[pixelOffset + 2];
    case 'alpha':
      return pixels[pixelOffset + 3];
  }
}

export function extractChannelAsGrayscale(image: RasterImage, channelId: ChannelId): Uint8ClampedArray {
  const { pixels } = image;
  const out = new Uint8ClampedArray(pixels.length);

  for (let o = 0; o < pixels.length; o += 4) {
    const value = readChannelValue(pixels, o, channelId);
    out[o] = value;
    out[o + 1] = value;
    out[o + 2] = value;
    out[o + 3] = 255;
  }

  return out;
}
