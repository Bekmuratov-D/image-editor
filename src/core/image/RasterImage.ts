export type SourceFormat = 'png' | 'jpg' | 'gb7';

/**
 * Общая модель изображения в памяти. И PNG/JPG (через canvas), и GB7
 * (свой декодер) на выходе дают именно такую структуру — дальше весь
 * остальной код (canvas, статус-бар, будущие лабы) работает только с ней
 * и не знает, из какого формата пришла картинка.
 */
export interface RasterImage {
  width: number;
  height: number;
  /** RGBA, построчно, без отступов — совпадает по формату с ImageData.data */
  pixels: Uint8ClampedArray;
  /** глубина цвета для статус-бара: 8 для png/jpg, 7 для gb7 */
  bitDepth: number;
  hasMask: boolean;
  sourceFormat: SourceFormat;
}
