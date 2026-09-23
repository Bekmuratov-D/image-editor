import { describe, expect, it } from 'vitest';
import { decodeGb7 } from '../src/core/codecs/gb7/gb7Decoder';
import { encodeGb7 } from '../src/core/codecs/gb7/gb7Encoder';
import type { RasterImage } from '../src/core/image/RasterImage';

function makeImage(pixels: number[], width: number, height: number, hasMask = false): RasterImage {
  return {
    width,
    height,
    pixels: new Uint8ClampedArray(pixels),
    bitDepth: 8,
    hasMask,
    isGrayscale: false,
    sourceFormat: 'png',
  };
}

describe('encodeGb7 / decodeGb7 round-trip', () => {
  it('сохраняет размеры и серый тон с точностью до округления 7 бит', () => {
    const image = makeImage(
      [
        0, 0, 0, 255,
        255, 255, 255, 255,
      ],
      2,
      1,
    );

    const encoded = encodeGb7(image, { includeMask: false });
    const decoded = decodeGb7(encoded.buffer);

    expect(decoded.width).toBe(2);
    expect(decoded.height).toBe(1);
    expect(decoded.hasMask).toBe(false);
    expect(decoded.pixels[0]).toBeLessThanOrEqual(2);
    expect(decoded.pixels[4]).toBeGreaterThanOrEqual(253);
  });

  it('сохраняет маску через альфа-канал', () => {
    const image = makeImage(
      [
        200, 200, 200, 0,
        200, 200, 200, 255,
      ],
      2,
      1,
      true,
    );

    const encoded = encodeGb7(image, { includeMask: true });
    const decoded = decodeGb7(encoded.buffer);

    expect(decoded.hasMask).toBe(true);
    expect(decoded.pixels[3]).toBe(0);
    expect(decoded.pixels[7]).toBe(255);
  });
});
