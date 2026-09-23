import { describe, expect, it } from 'vitest';
import { buildLevelsLut, createIdentityLevels } from '../src/core/levels/buildLevelsLut';

describe('buildLevelsLut', () => {
  it('тождественные настройки не меняют значения', () => {
    const lut = buildLevelsLut(createIdentityLevels());
    for (let i = 0; i < 256; i++) {
      expect(lut[i]).toBe(i);
    }
  });

  it('всё что <= чёрной точки становится 0', () => {
    const lut = buildLevelsLut({ black: 50, white: 255, gamma: 1 });
    expect(lut[0]).toBe(0);
    expect(lut[50]).toBe(0);
  });

  it('всё что >= белой точки становится 255', () => {
    const lut = buildLevelsLut({ black: 0, white: 200, gamma: 1 });
    expect(lut[200]).toBe(255);
    expect(lut[255]).toBe(255);
  });

  it('гамма < 1 затемняет средние тона, гамма > 1 осветляет', () => {
    const darker = buildLevelsLut({ black: 0, white: 255, gamma: 0.5 });
    const lighter = buildLevelsLut({ black: 0, white: 255, gamma: 2 });
    expect(darker[128]).toBeLessThan(128);
    expect(lighter[128]).toBeGreaterThan(128);
  });
});
