import { useEffect, useRef, type MouseEvent } from 'react';
import type { RasterImage } from '../../core/image/RasterImage';
import styles from './CanvasViewer.module.css';

interface CanvasViewerProps {
  image: RasterImage | null;
  displayPixels: Uint8ClampedArray | null;
  eyedropperActive?: boolean;
  onPixelPick?: (x: number, y: number) => void;
}

export function CanvasViewer({ image, displayPixels, eyedropperActive, onPixelPick }: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !displayPixels) {
      return;
    }
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const imageData = new ImageData(displayPixels, image.width, image.height);
    ctx.putImageData(imageData, 0, 0);
  }, [image, displayPixels]);

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !eyedropperActive || !onPixelPick) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.min(image.width - 1, Math.max(0, Math.floor((event.clientX - rect.left) * scaleX)));
    const y = Math.min(image.height - 1, Math.max(0, Math.floor((event.clientY - rect.top) * scaleY)));
    onPixelPick(x, y);
  };

  if (!image) {
    return <div className={styles.placeholder}>Загрузите изображение (PNG, JPG или GB7)</div>;
  }

  return (
    <div className={styles.viewport}>
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${eyedropperActive ? styles.canvasPicking : ''}`}
        onClick={handleClick}
      />
    </div>
  );
}
