import { useEffect, useRef } from 'react';
import type { RasterImage } from '../../core/image/RasterImage';
import styles from './CanvasViewer.module.css';

interface CanvasViewerProps {
  image: RasterImage | null;
}

export function CanvasViewer({ image }: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      return;
    }
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const imageData = new ImageData(image.pixels, image.width, image.height);
    ctx.putImageData(imageData, 0, 0);
  }, [image]);

  if (!image) {
    return <div className={styles.placeholder}>Загрузите изображение (PNG, JPG или GB7)</div>;
  }

  return (
    <div className={styles.viewport}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
