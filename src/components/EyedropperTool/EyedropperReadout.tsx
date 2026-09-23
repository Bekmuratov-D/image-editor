import type { EyedropperResult } from '../../hooks/useEyedropper';
import styles from './EyedropperReadout.module.css';

interface EyedropperReadoutProps {
  active: boolean;
  result: EyedropperResult | null;
}

export function EyedropperReadout({ active, result }: EyedropperReadoutProps) {
  if (!active) {
    return null;
  }

  if (!result) {
    return (
      <div className={styles.panel}>
        <div className={styles.title}>Пипетка</div>
        <div className={styles.hint}>Кликните по изображению</div>
      </div>
    );
  }

  const { x, y, r, g, b, lab } = result;

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Пипетка</div>
      <div className={styles.swatch} style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }} />
      <div className={styles.row}>
        <span>X, Y</span>
        <span>
          {x}, {y}
        </span>
      </div>
      <div className={styles.row}>
        <span>RGB</span>
        <span>
          {r}, {g}, {b}
        </span>
      </div>
      <div className={styles.row}>
        <span>Lab</span>
        <span>
          {lab.l.toFixed(1)}, {lab.a.toFixed(1)}, {lab.b.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
