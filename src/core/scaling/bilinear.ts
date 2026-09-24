import type { InterpolationFn } from './InterpolationAlgorithm';

function clamp(value: number, lo: number, hi: number): number {
  return value < lo ? lo : value > hi ? hi : value;
}

export const bilinearResample: InterpolationFn = (source, targetWidth, targetHeight) => {
  const { data, width: srcW, height: srcH } = source;
  const out = new Uint8ClampedArray(targetWidth * targetHeight * 4);
  const scaleX = srcW / targetWidth;
  const scaleY = srcH / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const sy = (y + 0.5) * scaleY - 0.5;
    const y0 = Math.floor(sy);
    const fy = sy - y0;
    const y0c = clamp(y0, 0, srcH - 1);
    const y1c = clamp(y0 + 1, 0, srcH - 1);

    for (let x = 0; x < targetWidth; x++) {
      const sx = (x + 0.5) * scaleX - 0.5;
      const x0 = Math.floor(sx);
      const fx = sx - x0;
      const x0c = clamp(x0, 0, srcW - 1);
      const x1c = clamp(x0 + 1, 0, srcW - 1);

      const o00 = (y0c * srcW + x0c) * 4;
      const o10 = (y0c * srcW + x1c) * 4;
      const o01 = (y1c * srcW + x0c) * 4;
      const o11 = (y1c * srcW + x1c) * 4;
      const dst = (y * targetWidth + x) * 4;

      for (let c = 0; c < 4; c++) {
        const top = data[o00 + c] * (1 - fx) + data[o10 + c] * fx;
        const bottom = data[o01 + c] * (1 - fx) + data[o11 + c] * fx;
        out[dst + c] = top * (1 - fy) + bottom * fy;
      }
    }
  }

  return out;
};
