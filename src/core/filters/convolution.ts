import { FILTER_CHANNEL_OFFSETS, type EdgeMode, type FilterChannel, type Kernel3x3 } from './types';

function clamp(value: number, lo: number, hi: number): number {
  return value < lo ? lo : value > hi ? hi : value;
}

function sampleTap(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  channelOffset: number,
  edgeMode: EdgeMode,
): number {
  if (x >= 0 && x < width && y >= 0 && y < height) {
    return pixels[(y * width + x) * 4 + channelOffset];
  }
  if (edgeMode === 'black') {
    return 0;
  }
  if (edgeMode === 'white') {
    return 255;
  }
  return pixels[(clamp(y, 0, height - 1) * width + clamp(x, 0, width - 1)) * 4 + channelOffset];
}

export function applyConvolution3x3Rows(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: Kernel3x3,
  channels: FilterChannel[],
  edgeMode: EdgeMode,
  out: Uint8ClampedArray,
  rowStart: number,
  rowEnd: number,
): void {
  const offsets = channels.map((channel) => FILTER_CHANNEL_OFFSETS[channel]);

  for (let y = rowStart; y < rowEnd; y++) {
    for (let x = 0; x < width; x++) {
      const dst = (y * width + x) * 4;
      for (const ch of offsets) {
        let sum = 0;
        let k = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            sum += kernel[k++] * sampleTap(pixels, width, height, x + kx, y + ky, ch, edgeMode);
          }
        }
        out[dst + ch] = sum;
      }
    }
  }
}

export function applyConvolution3x3(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: Kernel3x3,
  channels: FilterChannel[],
  edgeMode: EdgeMode,
): Uint8ClampedArray {
  const out = Uint8ClampedArray.from(pixels);
  applyConvolution3x3Rows(pixels, width, height, kernel, channels, edgeMode, out, 0, height);
  return out;
}
