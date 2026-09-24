import type { Kernel3x3 } from './types';

export type FilterPresetId = 'identity' | 'sharpen' | 'gaussian' | 'boxBlur' | 'prewittGx' | 'prewittGy';

export const FILTER_PRESETS: Record<FilterPresetId, Kernel3x3> = {
  identity: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  gaussian: [1 / 16, 2 / 16, 1 / 16, 2 / 16, 4 / 16, 2 / 16, 1 / 16, 2 / 16, 1 / 16],
  boxBlur: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
  prewittGx: [-1, 0, 1, -1, 0, 1, -1, 0, 1],
  prewittGy: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
};

export const FILTER_PRESET_IDS: FilterPresetId[] = [
  'identity',
  'sharpen',
  'gaussian',
  'boxBlur',
  'prewittGx',
  'prewittGy',
];

export const DEFAULT_FILTER_PRESET_ID: FilterPresetId = 'identity';
