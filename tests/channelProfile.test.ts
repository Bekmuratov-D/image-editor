import { describe, expect, it } from 'vitest';
import { getChannelProfile } from '../src/core/channels/channelProfile';
import type { RasterImage } from '../src/core/image/RasterImage';

function makeImage(isGrayscale: boolean, hasMask: boolean): RasterImage {
  return {
    width: 1,
    height: 1,
    pixels: new Uint8ClampedArray(4),
    bitDepth: 8,
    hasMask,
    isGrayscale,
    sourceFormat: 'png',
  };
}

describe('getChannelProfile', () => {
  it('grayscale без альфы -> 1 канал', () => {
    const profile = getChannelProfile(makeImage(true, false));
    expect(profile.category).toBe('gray');
    expect(profile.channels.map((c) => c.id)).toEqual(['gray']);
  });

  it('grayscale с альфой -> 2 канала', () => {
    const profile = getChannelProfile(makeImage(true, true));
    expect(profile.category).toBe('gray-alpha');
    expect(profile.channels.map((c) => c.id)).toEqual(['gray', 'alpha']);
  });

  it('RGB без альфы -> 3 канала', () => {
    const profile = getChannelProfile(makeImage(false, false));
    expect(profile.category).toBe('rgb');
    expect(profile.channels.map((c) => c.id)).toEqual(['r', 'g', 'b']);
  });

  it('RGB с альфой -> 4 канала', () => {
    const profile = getChannelProfile(makeImage(false, true));
    expect(profile.category).toBe('rgb-alpha');
    expect(profile.channels.map((c) => c.id)).toEqual(['r', 'g', 'b', 'alpha']);
  });
});
