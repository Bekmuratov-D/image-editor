import { buildLevelsLut, createIdentityLevels, type LevelsSettings } from './buildLevelsLut';

export type LevelsTargetId = 'master' | 'r' | 'g' | 'b' | 'alpha';
export type LevelsState = Record<LevelsTargetId, LevelsSettings>;

export function createDefaultLevelsState(): LevelsState {
  return {
    master: createIdentityLevels(),
    r: createIdentityLevels(),
    g: createIdentityLevels(),
    b: createIdentityLevels(),
    alpha: createIdentityLevels(),
  };
}

function composeLuts(base: Uint8ClampedArray, next: Uint8ClampedArray): Uint8ClampedArray {
  const out = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) {
    out[i] = next[base[i]];
  }
  return out;
}

export function buildCombinedLuts(state: LevelsState) {
  const masterLut = buildLevelsLut(state.master);
  return {
    r: composeLuts(masterLut, buildLevelsLut(state.r)),
    g: composeLuts(masterLut, buildLevelsLut(state.g)),
    b: composeLuts(masterLut, buildLevelsLut(state.b)),
    alpha: buildLevelsLut(state.alpha),
  };
}

export function applyLevels(pixels: Uint8ClampedArray, state: LevelsState): Uint8ClampedArray {
  const { r: rLut, g: gLut, b: bLut, alpha: alphaLut } = buildCombinedLuts(state);
  const out = new Uint8ClampedArray(pixels.length);

  for (let o = 0; o < pixels.length; o += 4) {
    out[o] = rLut[pixels[o]];
    out[o + 1] = gLut[pixels[o + 1]];
    out[o + 2] = bLut[pixels[o + 2]];
    out[o + 3] = alphaLut[pixels[o + 3]];
  }

  return out;
}
