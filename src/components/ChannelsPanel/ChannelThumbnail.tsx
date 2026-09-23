import { useEffect, useRef } from 'react';
import type { RasterImage } from '../../core/image/RasterImage';
import type { ChannelId } from '../../core/channels/channelProfile';
import { extractChannelAsGrayscale } from '../../core/channels/extractChannel';
import styles from './ChannelThumbnail.module.css';

interface ChannelThumbnailProps {
  image: RasterImage;
  channelId: ChannelId;
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function ChannelThumbnail({ image, channelId, label, active, onToggle }: ChannelThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const pixels = extractChannelAsGrayscale(image, channelId);
    ctx.putImageData(new ImageData(pixels, image.width, image.height), 0, 0);
  }, [image, channelId]);

  return (
    <button
      type="button"
      className={`${styles.thumb} ${active ? styles.active : styles.inactive}`}
      onClick={onToggle}
      aria-pressed={active}
    >
      <span className={styles.canvasBox}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
