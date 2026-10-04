import { describe, expect, it } from 'vitest';
import { getLevelsTargets } from '../src/core/levels/levelsTargets';
import type { ChannelProfile } from '../src/core/channels/channelProfile';

function profile(isGrayscale: boolean, hasAlpha: boolean): ChannelProfile {
  return { category: 'rgb', channels: [], isGrayscale, hasAlpha };
}

describe('getLevelsTargets', () => {
  it('RGB без альфы — Master, R, G, B', () => {
    expect(getLevelsTargets(profile(false, false)).map((t) => t.id)).toEqual(['master', 'r', 'g', 'b']);
  });

  it('RGBA — добавляется Alpha', () => {
    expect(getLevelsTargets(profile(false, true)).map((t) => t.id)).toEqual(['master', 'r', 'g', 'b', 'alpha']);
  });

  it('серое изображение — только Ч/Б, без отдельных R/G/B', () => {
    expect(getLevelsTargets(profile(true, false))).toEqual([{ id: 'master', label: 'Ч/Б' }]);
  });

  it('серое с альфой — Ч/Б и Alpha', () => {
    expect(getLevelsTargets(profile(true, true)).map((t) => t.id)).toEqual(['master', 'alpha']);
  });
});
