export interface LevelsSettings {
  black: number;
  white: number;
  gamma: number;
}

export function createIdentityLevels(): LevelsSettings {
  return { black: 0, white: 255, gamma: 1 };
}

export function buildLevelsLut({ black, white, gamma }: LevelsSettings): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256);
  const range = Math.max(1, white - black);
  const invGamma = 1 / gamma;

  for (let i = 0; i < 256; i++) {
    const clamped = Math.min(white, Math.max(black, i));
    const normalized = (clamped - black) / range;
    lut[i] = Math.round(Math.pow(normalized, invGamma) * 255);
  }

  return lut;
}
