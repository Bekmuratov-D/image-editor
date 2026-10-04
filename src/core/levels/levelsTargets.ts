import type { ChannelProfile } from '../channels/channelProfile';
import type { LevelsTargetId } from './applyLevels';

export interface LevelsTarget {
  id: LevelsTargetId;
  label: string;
}

// Список каналов в «Уровнях» повторяет каналы самого изображения (как на панели каналов).
// У серого изображения R=G=B, поэтому единственный цветовой канал «Ч/Б» — это master:
// он меняет R, G и B одинаково, и изображение остаётся серым.
export function getLevelsTargets(profile: ChannelProfile): LevelsTarget[] {
  const colorTargets: LevelsTarget[] = profile.isGrayscale
    ? [{ id: 'master', label: 'Ч/Б' }]
    : [
        { id: 'master', label: 'Master (RGB)' },
        { id: 'r', label: 'Red' },
        { id: 'g', label: 'Green' },
        { id: 'b', label: 'Blue' },
      ];
  return profile.hasAlpha ? [...colorTargets, { id: 'alpha', label: 'Alpha' }] : colorTargets;
}
