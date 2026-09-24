import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { resizePixels } from '../core/scaling/resizePixels';
import { clampZoom, computeAutoFitZoom } from '../core/zoom/zoomConstraints';

export function useZoom(image: RasterImage | null, sourcePixels: Uint8ClampedArray | null) {
  const [zoomPercent, setZoomPercentState] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!image || !containerRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    setZoomPercentState(computeAutoFitZoom(rect.width, rect.height, image.width, image.height));
  }, [image]);

  const setZoomPercent = useCallback((next: number) => {
    setZoomPercentState(clampZoom(next));
  }, []);

  const canvasWidth = image ? Math.max(1, Math.round((image.width * zoomPercent) / 100)) : 0;
  const canvasHeight = image ? Math.max(1, Math.round((image.height * zoomPercent) / 100)) : 0;

  const zoomedPixels = useMemo(() => {
    if (!image || !sourcePixels) {
      return null;
    }
    return resizePixels(sourcePixels, image.width, image.height, canvasWidth, canvasHeight);
  }, [image, sourcePixels, canvasWidth, canvasHeight]);

  return { zoomPercent, setZoomPercent, containerRef, canvasWidth, canvasHeight, zoomedPixels };
}
