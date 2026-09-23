import { describe, expect, it } from 'vitest';
import { applyChannelVisibility } from '../src/core/channels/applyChannelVisibility';
import { createDefaultVisibility, toggleChannel } from '../src/core/channels/channelVisibility';
import { extractChannelAsGrayscale, extractChannelPreview } from '../src/core/channels/extractChannel';
import type { RasterImage } from '../src/core/image/RasterImage';

function makeRgbaImage(): RasterImage {
  return {
    width: 1,
    height: 1,
    pixels: new Uint8ClampedArray([10, 20, 30, 128]),
    bitDepth: 8,
    hasMask: true,
    isGrayscale: false,
    sourceFormat: 'png',
  };
}

describe('extractChannelAsGrayscale', () => {
  it('строит серую картинку из значения канала, не трогая оригинал', () => {
    const image = makeRgbaImage();
    const originalPixels = image.pixels;
    const originalBytes = Array.from(originalPixels);

    const result = extractChannelAsGrayscale(image, 'g');

    expect(Array.from(result)).toEqual([20, 20, 20, 255]);
    expect(image.pixels).toBe(originalPixels);
    expect(Array.from(image.pixels)).toEqual(originalBytes);
  });
});

describe('extractChannelPreview', () => {
  it('тонирует R/G/B канал в его цвет', () => {
    const image = makeRgbaImage();

    expect(Array.from(extractChannelPreview(image, 'r'))).toEqual([10, 0, 0, 255]);
    expect(Array.from(extractChannelPreview(image, 'g'))).toEqual([0, 20, 0, 255]);
    expect(Array.from(extractChannelPreview(image, 'b'))).toEqual([0, 0, 30, 255]);
  });

  it('alpha остаётся чёрно-белой', () => {
    const image = makeRgbaImage();
    expect(Array.from(extractChannelPreview(image, 'alpha'))).toEqual([128, 128, 128, 255]);
  });
});

describe('applyChannelVisibility', () => {
  it('по умолчанию (всё включено) возвращает картинку без изменений', () => {
    const image = makeRgbaImage();
    const result = applyChannelVisibility(image, createDefaultVisibility());
    expect(Array.from(result)).toEqual([10, 20, 30, 128]);
  });

  it('выключенный канал зануляется, оригинал не меняется', () => {
    const image = makeRgbaImage();
    const originalBytes = Array.from(image.pixels);
    const visibility = toggleChannel(createDefaultVisibility(), 'r');

    const result = applyChannelVisibility(image, visibility);

    expect(Array.from(result)).toEqual([0, 20, 30, 128]);
    expect(Array.from(image.pixels)).toEqual(originalBytes);
  });

  it('выключенная альфа даёт полностью непрозрачный пиксель', () => {
    const image = makeRgbaImage();
    const visibility = toggleChannel(createDefaultVisibility(), 'alpha');

    const result = applyChannelVisibility(image, visibility);
    expect(result[3]).toBe(255);
  });

  it('если остаётся только альфа — показываем её как ч/б маску', () => {
    const image = makeRgbaImage();
    let visibility = createDefaultVisibility();
    visibility = toggleChannel(visibility, 'r');
    visibility = toggleChannel(visibility, 'g');
    visibility = toggleChannel(visibility, 'b');

    const result = applyChannelVisibility(image, visibility);
    expect(Array.from(result)).toEqual([128, 128, 128, 255]);
  });
});
