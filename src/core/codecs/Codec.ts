import type { RasterImage } from '../image/RasterImage';

/**
 * Общий интерфейс кодека формата изображения. pngJpgCodec реализует его
 * через встроенные возможности браузера, gb7 — полностью руками.
 */
export interface ImageCodec {
  decode(bytes: ArrayBuffer): RasterImage | Promise<RasterImage>;
  encode(image: RasterImage): Uint8Array | Promise<Uint8Array>;
}
