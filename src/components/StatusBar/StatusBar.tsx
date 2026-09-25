import { useRef, type ChangeEvent } from 'react';
import type { RasterImage } from '../../core/image/RasterImage';
import { MAX_ZOOM, MIN_ZOOM } from '../../core/zoom/zoomConstraints';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  image: RasterImage | null;
  fileName: string | null;
  fileSize: number | null;
  error: string | null;
  zoomPercent: number;
  onZoomChange: (percent: number) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} байт`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} КБ`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function formatBitDepth(image: RasterImage): string {
  if (image.sourceFormat === 'gb7') {
    return image.hasMask ? '8 бит/пиксель — 7 бит серый + 1 бит маска (GB7)' : '7 бит/пиксель — оттенки серого (GB7)';
  }
  return '32 бит/пиксель — 8 бит × 4 кан. (RGBA)';
}

export function StatusBar({ image, fileName, fileSize, error, zoomPercent, onZoomChange }: StatusBarProps) {
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
      <div className={styles.fields}>
        {fileName && (
          <span className={styles.field}>
            <span className={styles.label}>Файл:</span> {fileName}
          </span>
        )}
        <span className={styles.field}>
          <span className={styles.label}>Формат:</span> {image.sourceFormat.toUpperCase()}
        </span>
        <span className={styles.field}>
          <span className={styles.label}>Ширина:</span> {image.width} px
        </span>
        <span className={styles.field}>
          <span className={styles.label}>Высота:</span> {image.height} px
        </span>
        <span className={styles.field}>
          <span className={styles.label}>Глубина цвета:</span> {formatBitDepth(image)}
        </span>
        {fileSize != null && (
          <span className={styles.field}>
            <span className={styles.label}>Размер:</span> {formatFileSize(fileSize)}
          </span>
        )}
      </div>
      <span className={styles.zoom}>
        <span className={styles.label}>Масштаб:</span>
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
