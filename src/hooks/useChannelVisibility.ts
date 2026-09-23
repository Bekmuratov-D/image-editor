import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { applyChannelVisibility } from '../core/channels/applyChannelVisibility';
import { type ChannelId, getChannelProfile } from '../core/channels/channelProfile';
import { createDefaultVisibility, toggleChannel } from '../core/channels/channelVisibility';

export function useChannelVisibility(image: RasterImage | null) {
  const profile = useMemo(() => (image ? getChannelProfile(image) : null), [image]);
  const [visibility, setVisibility] = useState(createDefaultVisibility());

  useEffect(() => {
    setVisibility(createDefaultVisibility());
  }, [image]);

  const toggle = useCallback((id: ChannelId) => {
    setVisibility((prev) => toggleChannel(prev, id));
  }, []);

  const displayPixels = useMemo(
    () => (image ? applyChannelVisibility(image, visibility) : null),
    [image, visibility],
  );

  return { profile, visibility, toggle, displayPixels };
}
