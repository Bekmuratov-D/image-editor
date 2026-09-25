import { useCallback, useEffect, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { withPixels } from '../core/image/withPixels';
import { applyConvolutionAsync } from '../core/filters/applyConvolutionAsync';
import { DEFAULT_FILTER_PRESET_ID, FILTER_PRESETS, type FilterPresetId } from '../core/filters/presets';
import {
  createDefaultFilterChannelSelection,
  selectedChannelList,
  type EdgeMode,
  type FilterChannel,
  type FilterChannelSelection,
  type Kernel3x3,
} from '../core/filters/types';

interface UseFilterDialogOptions {
  onApply: (next: RasterImage) => void;
}

export function useFilterDialog(image: RasterImage | null, { onApply }: UseFilterDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetId, setPresetId] = useState<FilterPresetId>(DEFAULT_FILTER_PRESET_ID);
  const [kernel, setKernel] = useState<Kernel3x3>(FILTER_PRESETS[DEFAULT_FILTER_PRESET_ID]);
  const [channels, setChannels] = useState<FilterChannelSelection>(createDefaultFilterChannelSelection);
  const [edgeMode, setEdgeMode] = useState<EdgeMode>('clamp');
  const [livePreview, setLivePreview] = useState(true);
  const [previewPixels, setPreviewPixels] = useState<Uint8ClampedArray | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const open = useCallback(() => {
    setPresetId(DEFAULT_FILTER_PRESET_ID);
    setKernel(FILTER_PRESETS[DEFAULT_FILTER_PRESET_ID]);
    setChannels(createDefaultFilterChannelSelection());
    setEdgeMode('clamp');
    setLivePreview(true);
    setIsOpen(true);
  }, []);

  const cancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const reset = useCallback(() => {
    setPresetId(DEFAULT_FILTER_PRESET_ID);
    setKernel(FILTER_PRESETS[DEFAULT_FILTER_PRESET_ID]);
    setChannels(createDefaultFilterChannelSelection());
    setEdgeMode('clamp');
  }, []);

  const selectPreset = useCallback((id: FilterPresetId) => {
    setPresetId(id);
    setKernel(FILTER_PRESETS[id]);
  }, []);

  const setKernelCell = useCallback((index: number, value: number) => {
    setKernel((prev) => prev.map((v, i) => (i === index ? (Number.isFinite(value) ? value : 0) : v)));
  }, []);

  const setChannel = useCallback((id: FilterChannel, checked: boolean) => {
    setChannels((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const setGrayChannel = useCallback((checked: boolean) => {
    setChannels((prev) => ({ ...prev, r: checked, g: checked, b: checked }));
  }, []);

  useEffect(() => {
    if (!isOpen || !livePreview || !image) {
      setPreviewPixels(null);
      setIsComputing(false);
      return;
    }
    let cancelled = false;
    setIsComputing(true);
    applyConvolutionAsync(image.pixels, image.width, image.height, kernel, selectedChannelList(channels), edgeMode, {
      isCancelled: () => cancelled,
    }).then((result) => {
      if (cancelled) {
        return;
      }
      setIsComputing(false);
      if (result) {
        setPreviewPixels(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, livePreview, image, kernel, channels, edgeMode]);

  const apply = useCallback(() => {
    if (!image) {
      return;
    }
    setIsApplying(true);
    applyConvolutionAsync(image.pixels, image.width, image.height, kernel, selectedChannelList(channels), edgeMode).then(
      (result) => {
        setIsApplying(false);
        if (result) {
          onApply(withPixels(image, result));
        }
        setIsOpen(false);
      },
    );
  }, [image, kernel, channels, edgeMode, onApply]);

  return {
    isOpen,
    presetId,
    kernel,
    channels,
    edgeMode,
    livePreview,
    previewPixels,
    isComputing,
    isApplying,
    open,
    cancel,
    reset,
    apply,
    selectPreset,
    setKernelCell,
    setChannel,
    setGrayChannel,
    setEdgeMode,
    setLivePreview,
  };
}
