import { useRef, type ChangeEvent } from 'react';
import type { RasterImage } from '../../core/image/RasterImage';
import { MAX_ZOOM, MIN_ZOOM } from '../../core/zoom/zoomConstraints';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  image: RasterImage | null;
  fileName: string | null;
  error: string | null;
  zoomPercent: number;
  onZoomChange: (percent: number) => void;
}

export function StatusBar({ image, fileName, error, zoomPercent, onZoomChange }: StatusBarProps) {
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null);

  const handleZoomInput = (event: ChangeEvent<HTMLInputElement>) => {
    pendingRef.current = Number(event.target.value);
    if (rafRef.current !== null) {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingRef.current !== null) {
        onZoomChange(pendingRef.current);
        pendingRef.current = null;
      }
    });
  };

  if (error) {
    return <div className={`${styles.bar} ${styles.error}`}>{error}</div>;
  }

  if (!image) {
    return <div className={styles.bar}>Нет загруженного изображения</div>;
  }

  return (
    <div className={styles.bar}>
      <span className={styles.info}>
        {fileName ? `${fileName} · ` : ''}
        {image.width}×{image.height}px · глубина цвета: {image.bitDepth} бит
      </span>
      <span className={styles.zoom}>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          value={zoomPercent}
          onChange={handleZoomInput}
          className={styles.zoomSlider}
        />
        {Math.round(zoomPercent)}%
      </span>
    </div>
  );
}
