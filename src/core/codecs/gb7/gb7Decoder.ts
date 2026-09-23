import {
  GB7_HEADER_SIZE,
  GB7_SIGNATURE,
  GB7_VERSION,
  MASK_FLAG_BIT,
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
