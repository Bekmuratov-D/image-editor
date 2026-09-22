import type { RasterImage } from '../image/RasterImage';

export interface ImageCodec {
  decode(bytes: ArrayBuffer): RasterImage | Promise<RasterImage>;
  encode(image: RasterImage): Uint8Array | Promise<Uint8Array>;
}
