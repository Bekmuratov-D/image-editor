import type { LevelsSettings } from './buildLevelsLut';

const MIN_GAP = 1;

export type LevelsMarker = 'black' | 'white' | 'gamma';

export function applyMarkerConstraint(current: LevelsSettings, marker: LevelsMarker, rawValue: number): LevelsSettings {
  if (marker === 'black') {
    return { ...current, black: Math.max(0, Math.min(rawValue, current.white - MIN_GAP)) };
  }

  if (marker === 'white') {
    return { ...current, white: Math.min(255, Math.max(rawValue, current.black + MIN_GAP)) };
  }

  const clamped = Math.min(current.white, Math.max(current.black, rawValue));
  const range = Math.max(1, current.white - current.black);
  const t = (clamped - current.black) / range;
  const safeT = Math.min(1 - 1e-6, Math.max(1e-6, t));
  const gamma = Math.min(9.9, Math.max(0.1, Math.log(safeT) / Math.log(0.5)));
  return { ...current, gamma };
}

export function gammaMarkerPosition(settings: LevelsSettings): number {
  const t = Math.pow(0.5, settings.gamma);
  return settings.black + t * (settings.white - settings.black);
}
