import { describe, expect, it } from 'vitest';
import { srgbToLab } from '../src/core/color/srgbToLab';

describe('srgbToLab', () => {
  it('чёрный -> L=0, a=0, b=0', () => {
    const lab = srgbToLab(0, 0, 0);
    expect(lab.l).toBeCloseTo(0, 5);
    expect(lab.a).toBeCloseTo(0, 5);
    expect(lab.b).toBeCloseTo(0, 5);
  });

  it('белый -> L=100, a=0, b=0', () => {
    const lab = srgbToLab(255, 255, 255);
    expect(lab.l).toBeCloseTo(100, 3);
    expect(lab.a).toBeCloseTo(0, 3);
    expect(lab.b).toBeCloseTo(0, 3);
  });

  it('чистый красный -> известное справочное значение Lab', () => {
    const lab = srgbToLab(255, 0, 0);
    expect(lab.l).toBeCloseTo(53.24, 1);
    expect(lab.a).toBeCloseTo(80.09, 1);
    expect(lab.b).toBeCloseTo(67.2, 1);
  });

  it('серый 50% -> a и b близки к 0 (нейтральный цвет)', () => {
    const lab = srgbToLab(128, 128, 128);
    expect(lab.a).toBeCloseTo(0, 3);
    expect(lab.b).toBeCloseTo(0, 3);
  });
});
