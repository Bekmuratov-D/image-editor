import type { RasterImage } from '../../core/image/RasterImage';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  image: RasterImage | null;
  fileName: string | null;
  error: string | null;
}

export function StatusBar({ image, fileName, error }: StatusBarProps) {
  if (error) {
    return <div className={`${styles.bar} ${styles.error}`}>{error}</div>;
  }

  if (!image) {
    return <div className={styles.bar}>Нет загруженного изображения</div>;
  }

  return (
    <div className={styles.bar}>
      {fileName ? `${fileName} · ` : ''}
      {image.width}×{image.height}px · глубина цвета: {image.bitDepth} бит
    </div>
  );
}
