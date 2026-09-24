import { useCallback, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { resizeImage } from '../core/scaling/resizeImage';
import { DEFAULT_INTERPOLATION_ID } from '../core/scaling/algorithms';
import type { InterpolationId } from '../core/scaling/InterpolationAlgorithm';

export type ResizeUnit = 'percent' | 'pixels';

const MIN_PX = 1;
const MAX_PX = 10000;
const MIN_PERCENT = 1;
const MAX_PERCENT = 1000;

function unitToPixels(value: number, unit: ResizeUnit, originalDimension: number): number {
  return unit === 'percent' ? (value / 100) * originalDimension : value;
}

function pixelsToUnit(px: number, unit: ResizeUnit, originalDimension: number): number {
  return unit === 'percent' ? (px / originalDimension) * 100 : px;
}

function clampFieldValue(value: number, unit: ResizeUnit): number {
  if (!Number.isFinite(value)) {
    return unit === 'percent' ? 100 : 1;
  }
  const min = unit === 'percent' ? MIN_PERCENT : MIN_PX;
  const max = unit === 'percent' ? MAX_PERCENT : MAX_PX;
  return Math.max(min, Math.min(max, value));
}

function clampPixels(px: number): number {
  return Math.max(MIN_PX, Math.min(MAX_PX, Math.round(px)));
}

interface UseResizeDialogOptions {
  onApply: (next: RasterImage) => void;
}

export function useResizeDialog(image: RasterImage | null, { onApply }: UseResizeDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<ResizeUnit>('pixels');
  const [widthPx, setWidthPx] = useState(0);
  const [heightPx, setHeightPx] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [algorithmId, setAlgorithmId] = useState<InterpolationId>(DEFAULT_INTERPOLATION_ID);

  const aspectRatio = image ? image.width / image.height : 1;

  const open = useCallback(() => {
    if (!image) {
      return;
    }
    setUnit('pixels');
    setWidthPx(image.width);
    setHeightPx(image.height);
    setLockAspect(true);
    setAlgorithmId(DEFAULT_INTERPOLATION_ID);
    setIsOpen(true);
  }, [image]);

  const cancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const widthField = image ? pixelsToUnit(widthPx, unit, image.width) : 0;
  const heightField = image ? pixelsToUnit(heightPx, unit, image.height) : 0;

  const setWidthField = useCallback(
    (raw: number) => {
      if (!image) {
        return;
      }
      const px = clampPixels(unitToPixels(clampFieldValue(raw, unit), unit, image.width));
      setWidthPx(px);
      if (lockAspect) {
        setHeightPx(clampPixels(px / aspectRatio));
      }
    },
    [image, unit, lockAspect, aspectRatio],
  );

  const setHeightField = useCallback(
    (raw: number) => {
      if (!image) {
        return;
      }
      const px = clampPixels(unitToPixels(clampFieldValue(raw, unit), unit, image.height));
      setHeightPx(px);
      if (lockAspect) {
        setWidthPx(clampPixels(px * aspectRatio));
      }
    },
    [image, unit, lockAspect, aspectRatio],
  );

  const megapixelsBefore = image ? (image.width * image.height) / 1_000_000 : 0;
  const megapixelsAfter = (widthPx * heightPx) / 1_000_000;

  const apply = useCallback(() => {
    if (!image) {
      return;
    }
    onApply(resizeImage(image, widthPx, heightPx, algorithmId));
    setIsOpen(false);
  }, [image, widthPx, heightPx, algorithmId, onApply]);

  return {
    isOpen,
    open,
    cancel,
    apply,
    unit,
    setUnit,
    widthField,
    heightField,
    setWidthField,
    setHeightField,
    lockAspect,
    setLockAspect,
    algorithmId,
    setAlgorithmId,
    megapixelsBefore,
    megapixelsAfter,
  };
}
