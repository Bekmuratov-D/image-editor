import type { InterpolationFn } from './InterpolationAlgorithm';

export const nearestNeighborResample: InterpolationFn = (source, targetWidth, targetHeight) => {
  const { data, width: srcW, height: srcH } = source;
  const out = new Uint8ClampedArray(targetWidth * targetHeight * 4);
  const scaleX = srcW / targetWidth;
  const scaleY = srcH / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const sy = Math.min(srcH - 1, Math.floor((y + 0.5) * scaleY));
    for (let x = 0; x < targetWidth; x++) {
      const sx = Math.min(srcW - 1, Math.floor((x + 0.5) * scaleX));
      const srcOffset = (sy * srcW + sx) * 4;
      const dstOffset = (y * targetWidth + x) * 4;
      out[dstOffset] = data[srcOffset];
      out[dstOffset + 1] = data[srcOffset + 1];
      out[dstOffset + 2] = data[srcOffset + 2];
      out[dstOffset + 3] = data[srcOffset + 3];
    }
  }

  return out;
};
