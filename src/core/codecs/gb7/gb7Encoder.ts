import type { RasterImage } from '../../image/RasterImage';
import { GB7_HEADER_SIZE, GB7_SIGNATURE, GB7_VERSION, MASK_FLAG_BIT, PIXEL_VALUE_MASK } from './gb7Constants';

export interface Gb7EncodeOptions {
  includeMask: boolean;
  maskThreshold?: number;
}

export function encodeGb7(image: RasterImage, options?: Gb7EncodeOptions): Uint8Array {
  const includeMask = options?.includeMask ?? image.hasMask;
  const threshold = options?.maskThreshold ?? 128;

  const { width, height, pixels } = image;
  const out = new Uint8Array(GB7_HEADER_SIZE + width * height);
  const view = new DataView(out.buffer);

  GB7_SIGNATURE.forEach((byte, i) => view.setUint8(i, byte));
  view.setUint8(4, GB7_VERSION);
  view.setUint8(5, includeMask ? MASK_FLAG_BIT : 0);
  view.setUint16(6, width, false);
  view.setUint16(8, height, false);
  view.setUint16(10, 0, false);

  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const gray8 = Math.round(0.299 * pixels[o] + 0.587 * pixels[o + 1] + 0.114 * pixels[o + 2]);
    const gray7 = gray8 >> 1;

    let byte = gray7 & PIXEL_VALUE_MASK;
    if (includeMask && pixels[o + 3] >= threshold) {
      byte |= 0b1000_0000;
    }

    out[GB7_HEADER_SIZE + i] = byte;
  }

  return out;
}
