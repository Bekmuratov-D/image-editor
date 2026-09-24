import { describe, expect, it } from 'vitest';
import { applyMarkerConstraint, gammaMarkerPosition } from '../src/core/levels/levelsConstraints';
import { createIdentityLevels } from '../src/core/levels/buildLevelsLut';

describe('applyMarkerConstraint', () => {
  it('чёрная точка не может зайти за белую', () => {
    const settings = { black: 0, white: 100, gamma: 1 };
    const result = applyMarkerConstraint(settings, 'black', 150);
    expect(result.black).toBeLessThan(result.white);
  });

  it('белая точка не может зайти за чёрную', () => {
    const settings = { black: 100, white: 255, gamma: 1 };
    const result = applyMarkerConstraint(settings, 'white', 10);
    expect(result.white).toBeGreaterThan(result.black);
  });

  it('маркер гаммы в середине -> gamma = 1', () => {
    const settings = { black: 0, white: 255, gamma: 1 };
    const result = applyMarkerConstraint(settings, 'gamma', 127.5);
    expect(result.gamma).toBeCloseTo(1, 1);
  });

  it('сдвиг маркера гаммы влево (к чёрной точке) увеличивает gamma (светлее)', () => {
    const settings = { black: 0, white: 255, gamma: 1 };
    const result = applyMarkerConstraint(settings, 'gamma', 60);
    expect(result.gamma).toBeGreaterThan(1);
  });

  it('сдвиг маркера гаммы вправо (к белой точке) уменьшает gamma (темнее)', () => {
    const settings = { black: 0, white: 255, gamma: 1 };
    const result = applyMarkerConstraint(settings, 'gamma', 200);
    expect(result.gamma).toBeLessThan(1);
  });

  it('gamma всегда в пределах 0.1 - 9.9', () => {
    const settings = { black: 0, white: 255, gamma: 1 };
    const veryLeft = applyMarkerConstraint(settings, 'gamma', 1);
    const veryRight = applyMarkerConstraint(settings, 'gamma', 254);
    expect(veryLeft.gamma).toBeLessThanOrEqual(9.9);
    expect(veryRight.gamma).toBeGreaterThanOrEqual(0.1);
  });
});

describe('gammaMarkerPosition', () => {
  it('тождественная gamma=1 -> маркер посередине между чёрной и белой точкой', () => {
    const position = gammaMarkerPosition(createIdentityLevels());
    expect(position).toBeCloseTo(127.5, 1);
  });

  it('согласована с applyMarkerConstraint (обратное преобразование)', () => {
    const settings = { black: 0, white: 255, gamma: 1 };
    const adjusted = applyMarkerConstraint(settings, 'gamma', 80);
    const position = gammaMarkerPosition(adjusted);
    expect(position).toBeCloseTo(80, 0);
  });
});
