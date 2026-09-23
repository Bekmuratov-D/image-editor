import type { RasterImage } from '../../image/RasterImage';
import {
  GB7_HEADER_SIZE,
  GB7_SIGNATURE,
  GB7_VERSION,
  MASK_FLAG_BIT,
  PIXEL_MASK_BIT,
  PIXEL_VALUE_MASK,
} from './gb7Constants';
import { Gb7Error } from './gb7Errors';

export interface Gb7Header {
  version: number;
  hasMask: boolean;
  width: number;
  height: number;
}

export function decodeGb7Header(buffer: ArrayBuffer): Gb7Header {
  if (buffer.byteLength < GB7_HEADER_SIZE) {
    throw new Gb7Error('Файл слишком мал для заголовка GB7');
  }

  const view = new DataView(buffer);

  for (let i = 0; i < GB7_SIGNATURE.length; i++) {
    if (view.getUint8(i) !== GB7_SIGNATURE[i]) {
      throw new Gb7Error('Неверная сигнатура GB7');
    }
  }

  const version = view.getUint8(4);
  if (version !== GB7_VERSION) {
    throw new Gb7Error(`Неподдерживаемая версия GB7: ${version}`);
  }

  const flags = view.getUint8(5);
  if ((flags & ~MASK_FLAG_BIT) !== 0) {
    throw new Gb7Error('Зарезервированные биты флага должны быть равны 0');
  }
  const hasMask = (flags & MASK_FLAG_BIT) !== 0;

  const width = view.getUint16(6, false);
  const height = view.getUint16(8, false);

  if (view.getUint16(10, false) !== 0) {
    throw new Gb7Error('Зарезервированные байты заголовка должны быть равны 0');
  }

  const expectedLength = GB7_HEADER_SIZE + width * height;
  if (buffer.byteLength < expectedLength) {
    throw new Gb7Error('Данные изображения GB7 обрезаны');
  }

  return { version, hasMask, width, height };
}

export function decodeGb7(buffer: ArrayBuffer): RasterImage {
  const { hasMask, width, height } = decodeGb7Header(buffer);

  const bytes = new Uint8Array(buffer, GB7_HEADER_SIZE, width * height);
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const raw = bytes[i];
    const gray7 = raw & PIXEL_VALUE_MASK;
    const gray8 = (gray7 << 1) | (gray7 >> 6);
    const visible = hasMask ? (raw & PIXEL_MASK_BIT) !== 0 : true;

    const o = i * 4;
    pixels[o] = gray8;
    pixels[o + 1] = gray8;
    pixels[o + 2] = gray8;
    pixels[o + 3] = visible ? 255 : 0;
  }

  return { width, height, pixels, bitDepth: 7, hasMask, sourceFormat: 'gb7' };
}
