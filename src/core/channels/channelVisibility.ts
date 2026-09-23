import type { ChannelId } from './channelProfile';

export interface ChannelVisibility {
  gray: boolean;
  r: boolean;
  g: boolean;
  b: boolean;
  alpha: boolean;
}

export function createDefaultVisibility(): ChannelVisibility {
  return { gray: true, r: true, g: true, b: true, alpha: true };
}

export function toggleChannel(visibility: ChannelVisibility, id: ChannelId): ChannelVisibility {
  return { ...visibility, [id]: !visibility[id] };
}
