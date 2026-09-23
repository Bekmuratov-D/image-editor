import type { RasterImage } from '../image/RasterImage';

export type ChannelId = 'gray' | 'r' | 'g' | 'b' | 'alpha';
export type ChannelCategory = 'gray' | 'gray-alpha' | 'rgb' | 'rgb-alpha';

export interface ChannelDescriptor {
  id: ChannelId;
  label: string;
}

export interface ChannelProfile {
  category: ChannelCategory;
  channels: ChannelDescriptor[];
  isGrayscale: boolean;
  hasAlpha: boolean;
}

export function getChannelProfile(image: RasterImage): ChannelProfile {
  const { isGrayscale, hasMask: hasAlpha } = image;

  const colorChannels: ChannelDescriptor[] = isGrayscale
    ? [{ id: 'gray', label: 'Ч/Б' }]
    : [
        { id: 'r', label: 'R' },
        { id: 'g', label: 'G' },
        { id: 'b', label: 'B' },
      ];

  const channels = hasAlpha ? [...colorChannels, { id: 'alpha' as const, label: 'Alpha' }] : colorChannels;

  const category: ChannelCategory = isGrayscale
    ? hasAlpha
      ? 'gray-alpha'
      : 'gray'
    : hasAlpha
      ? 'rgb-alpha'
      : 'rgb';

  return { category, channels, isGrayscale, hasAlpha };
}
