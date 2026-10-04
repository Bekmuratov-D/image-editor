import type { RasterImage } from '../image/RasterImage';
import { readJpegFrameInfo } from './jpegHeader';
import {
  hasAlphaPngColorType,
  isGrayscalePngColorType,
  pngBitsPerChannel,
  readPngBitDepth,
  readPngColorType,
} from './pngHeader';

export type SourceColorInfo = Pick<RasterImage, 'bitDepth' | 'bitsPerPixel' | 'hasMask' | 'isGrayscale'>;

// Сколько каналов реально хранит файл: серый — 1, серый+альфа — 2, RGB — 3, RGBA — 4.
function colorChannelCount(isGrayscale: boolean, hasMask: boolean): number {
  return (isGrayscale ? 1 : 3) + (hasMask ? 1 : 0);
}

export function readPngColorInfo(header: ArrayBuffer): SourceColorInfo {
  const colorType = readPngColorType(header);
  const bitDepth = pngBitsPerChannel(colorType, readPngBitDepth(header));
  const isGrayscale = isGrayscalePngColorType(colorType);
  const hasMask = hasAlphaPngColorType(colorType);
  return { bitDepth, bitsPerPixel: bitDepth * colorChannelCount(isGrayscale, hasMask), hasMask, isGrayscale };
}

// В JPEG альфа-канала не бывает; при неразборчивом заголовке считаем обычный 8-битный RGB.
export function readJpegColorInfo(file: ArrayBuffer): SourceColorInfo {
  const frame = readJpegFrameInfo(file);
  const bitDepth = frame?.precision ?? 8;
  const components = frame?.components ?? 3;
  return { bitDepth, bitsPerPixel: bitDepth * components, hasMask: false, isGrayscale: components === 1 };
}
