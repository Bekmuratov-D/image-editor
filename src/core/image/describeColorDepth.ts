import type { RasterImage } from './RasterImage';

function channelsLabel(image: RasterImage, channelCount: number): string {
  if (image.isGrayscale) {
    return image.hasMask ? 'оттенки серого + альфа' : 'оттенки серого';
  }
  if (channelCount === 4 && !image.hasMask) {
    return 'CMYK';
  }
  return image.hasMask ? 'RGBA' : 'RGB';
}

export function describeColorDepth(image: RasterImage): string {
  if (image.sourceFormat === 'gb7') {
    return image.hasMask
      ? `${image.bitsPerPixel} бит/пиксель — 7 бит серый + 1 бит маска (GB7)`
      : `${image.bitsPerPixel} бит/пиксель — оттенки серого (GB7)`;
  }
  const channelCount = image.bitsPerPixel / image.bitDepth;
  return `${image.bitsPerPixel} бит/пиксель — ${image.bitDepth} бит × ${channelCount} кан. (${channelsLabel(image, channelCount)})`;
}
