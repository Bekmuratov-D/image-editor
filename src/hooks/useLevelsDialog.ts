import { useCallback, useMemo, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { withPixels } from '../core/image/withPixels';
import { applyLevels, createDefaultLevelsState, type LevelsState, type LevelsTargetId } from '../core/levels/applyLevels';
import type { LevelsSettings } from '../core/levels/buildLevelsLut';
import type { HistogramScale } from '../core/histogram/scaleHistogramBars';

interface UseLevelsDialogOptions {
  onApply: (next: RasterImage) => void;
}

export function useLevelsDialog(image: RasterImage | null, { onApply }: UseLevelsDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<LevelsState>(createDefaultLevelsState);
  const [selectedTarget, setSelectedTarget] = useState<LevelsTargetId>('master');
  const [histogramScale, setHistogramScale] = useState<HistogramScale>('linear');
  const [livePreview, setLivePreview] = useState(true);

  const open = useCallback(() => {
    setState(createDefaultLevelsState());
    setSelectedTarget('master');
    setLivePreview(true);
    setIsOpen(true);
  }, []);

  const cancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const reset = useCallback(() => {
    setState(createDefaultLevelsState());
  }, []);

  const apply = useCallback(() => {
    if (!image) {
      return;
    }
    onApply(withPixels(image, applyLevels(image.pixels, state)));
    setIsOpen(false);
  }, [image, state, onApply]);

  const updateTarget = useCallback((target: LevelsTargetId, next: LevelsSettings) => {
    setState((prev) => ({ ...prev, [target]: next }));
  }, []);

  const previewPixels = useMemo(() => {
    if (!isOpen || !livePreview || !image) {
      return null;
    }
    return applyLevels(image.pixels, state);
  }, [isOpen, livePreview, image, state]);

  return {
    isOpen,
    state,
    selectedTarget,
    histogramScale,
    livePreview,
    previewPixels,
    open,
    cancel,
    reset,
    apply,
    updateTarget,
    setSelectedTarget,
    setHistogramScale,
    setLivePreview,
  };
}
