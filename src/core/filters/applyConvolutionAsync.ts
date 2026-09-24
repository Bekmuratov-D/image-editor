import { applyConvolution3x3Rows } from './convolution';
import type { EdgeMode, FilterChannel, Kernel3x3 } from './types';

export interface ConvolutionAsyncOptions {
  chunkRows?: number;
  isCancelled?: () => boolean;
}

const PIXELS_PER_CHUNK = 65_536;

export function applyConvolutionAsync(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: Kernel3x3,
  channels: FilterChannel[],
  edgeMode: EdgeMode,
  options: ConvolutionAsyncOptions = {},
): Promise<Uint8ClampedArray | null> {
  const chunkRows = options.chunkRows ?? Math.max(1, Math.floor(PIXELS_PER_CHUNK / width));
  const out = Uint8ClampedArray.from(pixels);

  return new Promise((resolve) => {
    let row = 0;

    function step() {
      if (options.isCancelled?.()) {
        resolve(null);
        return;
      }
      const rowEnd = Math.min(height, row + chunkRows);
      applyConvolution3x3Rows(pixels, width, height, kernel, channels, edgeMode, out, row, rowEnd);
      row = rowEnd;

      if (row >= height) {
        resolve(options.isCancelled?.() ? null : out);
        return;
      }
      setTimeout(step, 0);
    }

    step();
  });
}
