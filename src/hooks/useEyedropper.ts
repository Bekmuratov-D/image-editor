import { useCallback, useEffect, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { srgbToLab, type Lab } from '../core/color/srgbToLab';

export interface EyedropperResult {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  lab: Lab;
}

export function useEyedropper(image: RasterImage | null) {
  const [active, setActive] = useState(false);
  const [result, setResult] = useState<EyedropperResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [image]);

  const toggle = useCallback(() => {
    setActive((prev) => !prev);
  }, []);

  const pickAt = useCallback(
    (x: number, y: number) => {
      if (!image) {
        return;
      }
      const o = (y * image.width + x) * 4;
      const r = image.pixels[o];
      const g = image.pixels[o + 1];
      const b = image.pixels[o + 2];
      setResult({ x, y, r, g, b, lab: srgbToLab(r, g, b) });
    },
    [image],
  );

  return { active, toggle, result, pickAt };
}
