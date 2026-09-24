import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { withPixels } from '../core/image/withPixels';
import { applyChannelVisibility } from '../core/channels/applyChannelVisibility';
import { type ChannelId, getChannelProfile } from '../core/channels/channelProfile';
import { createDefaultVisibility, toggleChannel } from '../core/channels/channelVisibility';

export function useChannelVisibility(image: RasterImage | null, previewPixels?: Uint8ClampedArray | null) {
  const profile = useMemo(() => (image ? getChannelProfile(image) : null), [image]);
  const [visibility, setVisibility] = useState(createDefaultVisibility());

  useEffect(() => {
    setVisibility(createDefaultVisibility());
  }, [image]);

  const toggle = useCallback((id: ChannelId) => {
    setVisibility((prev) => toggleChannel(prev, id));
  }, []);

  const sourcePixels = previewPixels ?? image?.pixels ?? null;

  const displayPixels = useMemo(() => {
    if (!image || !sourcePixels) {
      return null;
    }
    const source = sourcePixels === image.pixels ? image : withPixels(image, sourcePixels);
    return applyChannelVisibility(source, visibility);
  }, [image, sourcePixels, visibility]);

  return { profile, visibility, toggle, displayPixels };
}
