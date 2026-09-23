import type { RasterImage } from '../../core/image/RasterImage';
import type { ChannelId, ChannelProfile } from '../../core/channels/channelProfile';
import type { ChannelVisibility } from '../../core/channels/channelVisibility';
import { ChannelThumbnail } from './ChannelThumbnail';
import styles from './ChannelsPanel.module.css';

interface ChannelsPanelProps {
  image: RasterImage;
  profile: ChannelProfile;
  visibility: ChannelVisibility;
  onToggle: (id: ChannelId) => void;
}

export function ChannelsPanel({ image, profile, visibility, onToggle }: ChannelsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.title}>Каналы</div>
      <div className={styles.grid}>
        {profile.channels.map((channel) => (
          <ChannelThumbnail
            key={channel.id}
            image={image}
            channelId={channel.id}
            label={channel.label}
            active={visibility[channel.id]}
            onToggle={() => onToggle(channel.id)}
          />
        ))}
      </div>
    </div>
  );
}
