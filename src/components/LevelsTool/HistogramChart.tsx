import { useEffect, useRef } from 'react';
import type { Histogram } from '../../core/histogram/computeHistogram';
import { scaleBarHeights, type HistogramScale } from '../../core/histogram/scaleHistogramBars';
import styles from './HistogramChart.module.css';

interface HistogramChartProps {
  histogram: Histogram;
  scale: HistogramScale;
  color?: string;
}

const CHART_WIDTH = 256;
const CHART_HEIGHT = 120;

export function HistogramChart({ histogram, scale, color = '#3f3f46' }: HistogramChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }

    ctx.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
    ctx.fillStyle = color;

    const heights = scaleBarHeights(histogram, scale);
    heights.forEach((height, i) => {
      const barHeight = height * CHART_HEIGHT;
      ctx.fillRect(i, CHART_HEIGHT - barHeight, 1, barHeight);
    });
  }, [histogram, scale, color]);

  return <canvas ref={canvasRef} width={CHART_WIDTH} height={CHART_HEIGHT} className={styles.canvas} />;
}
