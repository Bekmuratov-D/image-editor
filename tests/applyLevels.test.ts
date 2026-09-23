import { describe, expect, it } from 'vitest';
import { applyLevels, createDefaultLevelsState } from '../src/core/levels/applyLevels';
import { createIdentityLevels } from '../src/core/levels/buildLevelsLut';

function makePixels(): Uint8ClampedArray {
  return new Uint8ClampedArray([10, 20, 30, 200]);
}

describe('applyLevels', () => {
  it('тождественные настройки по всем целям не меняют пиксели', () => {
    const pixels = makePixels();
    const result = applyLevels(pixels, createDefaultLevelsState());
    expect(Array.from(result)).toEqual(Array.from(pixels));
  });

  it('не мутирует исходный массив', () => {
    const pixels = makePixels();
    const originalBytes = Array.from(pixels);
    applyLevels(pixels, createDefaultLevelsState());
    expect(Array.from(pixels)).toEqual(originalBytes);
  });

  it('master применяется к R/G/B, но не трогает alpha', () => {
    const pixels = makePixels();
    const state = createDefaultLevelsState();
    state.master = { black: 0, white: 128, gamma: 1 };

    const result = applyLevels(pixels, state);

    expect(result[0]).toBeGreaterThan(pixels[0]);
    expect(result[3]).toBe(pixels[3]);
  });

  it('настройка конкретного канала применяется после master', () => {
    const pixels = makePixels();
    const state = createDefaultLevelsState();
    state.master = { black: 0, white: 128, gamma: 1 };
    state.r = { black: 0, white: 64, gamma: 1 };

    const result = applyLevels(pixels, state);
    const masterOnlyState = { ...createDefaultLevelsState(), master: state.master };
    const masterOnlyResult = applyLevels(pixels, masterOnlyState);

    expect(result[0]).not.toBe(masterOnlyResult[0]);
  });

  it('альфа никогда не смешивается с master', () => {
    const pixels = makePixels();
    const state = createDefaultLevelsState();
    state.master = { black: 0, white: 100, gamma: 1 };

    const result = applyLevels(pixels, state);
    expect(result[3]).toBe(pixels[3]);
  });

  it('createIdentityLevels даёт тождественное преобразование', () => {
    expect(createIdentityLevels()).toEqual({ black: 0, white: 255, gamma: 1 });
  });
});
