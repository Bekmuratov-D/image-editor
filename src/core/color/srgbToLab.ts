import { D65_WHITE, RGB_TO_XYZ_MATRIX } from './colorConstants';

export interface Lab {
  l: number;
  a: number;
  b: number;
}

function srgbChannelToLinear(channel8: number): number {
  const c = channel8 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

const DELTA = 6 / 29;

function xyzComponentToLabF(t: number): number {
  return t > DELTA ** 3 ? Math.cbrt(t) : t / (3 * DELTA * DELTA) + 4 / 29;
}

export function srgbToLab(r8: number, g8: number, b8: number): Lab {
  const r = srgbChannelToLinear(r8);
  const g = srgbChannelToLinear(g8);
  const b = srgbChannelToLinear(b8);

  const [rowX, rowY, rowZ] = RGB_TO_XYZ_MATRIX;
  const x = rowX[0] * r + rowX[1] * g + rowX[2] * b;
  const y = rowY[0] * r + rowY[1] * g + rowY[2] * b;
  const z = rowZ[0] * r + rowZ[1] * g + rowZ[2] * b;

  const fx = xyzComponentToLabF(x / D65_WHITE.xn);
  const fy = xyzComponentToLabF(y / D65_WHITE.yn);
  const fz = xyzComponentToLabF(z / D65_WHITE.zn);

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}
