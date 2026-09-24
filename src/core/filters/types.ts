export type Kernel3x3 = number[];
export type EdgeMode = 'black' | 'white' | 'clamp';
export type FilterChannel = 'r' | 'g' | 'b' | 'alpha';

export interface FilterChannelSelection {
  r: boolean;
  g: boolean;
  b: boolean;
  alpha: boolean;
}

export const FILTER_CHANNEL_OFFSETS: Record<FilterChannel, number> = {
  r: 0,
  g: 1,
  b: 2,
  alpha: 3,
};

export function createDefaultFilterChannelSelection(): FilterChannelSelection {
  return { r: true, g: true, b: true, alpha: false };
}

export function selectedChannelList(selection: FilterChannelSelection): FilterChannel[] {
  return (['r', 'g', 'b', 'alpha'] as const).filter((channel) => selection[channel]);
}
