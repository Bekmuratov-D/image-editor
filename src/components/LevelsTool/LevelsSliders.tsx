import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import type { LevelsSettings } from '../../core/levels/buildLevelsLut';
import { applyMarkerConstraint, gammaMarkerPosition, type LevelsMarker } from '../../core/levels/levelsConstraints';
import styles from './LevelsSliders.module.css';

interface LevelsSlidersProps {
  settings: LevelsSettings;
  onChange: (next: LevelsSettings) => void;
}

function valueToPercent(value: number): number {
  return (value / 255) * 100;
}

export function LevelsSliders({ settings, onChange }: LevelsSlidersProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ marker: LevelsMarker; value: number } | null>(null);

  const valueFromClientX = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) {
      return 0;
    }
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(fraction * 255);
  };

  const scheduleCommit = (marker: LevelsMarker, value: number) => {
    pendingRef.current = { marker, value };
    if (rafRef.current !== null) {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingRef.current) {
        onChange(applyMarkerConstraint(settings, pendingRef.current.marker, pendingRef.current.value));
        pendingRef.current = null;
      }
    });
  };

  const startDrag = (marker: LevelsMarker) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const handleMove = (moveEvent: PointerEvent) => {
      scheduleCommit(marker, valueFromClientX(moveEvent.clientX));
    };

    const handleUp = (upEvent: PointerEvent) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      onChange(applyMarkerConstraint(settings, marker, valueFromClientX(upEvent.clientX)));
      target.removeEventListener('pointermove', handleMove);
      target.removeEventListener('pointerup', handleUp);
    };

    target.addEventListener('pointermove', handleMove);
    target.addEventListener('pointerup', handleUp, { once: true });
  };

  const gammaPosition = gammaMarkerPosition(settings);

  return (
    <div className={styles.wrapper}>
      <div ref={trackRef} className={styles.track}>
        <div
          className={`${styles.marker} ${styles.markerBlack}`}
          style={{ left: `${valueToPercent(settings.black)}%` }}
          onPointerDown={startDrag('black')}
        />
        <div
          className={`${styles.marker} ${styles.markerGamma}`}
          style={{ left: `${valueToPercent(gammaPosition)}%` }}
          onPointerDown={startDrag('gamma')}
        />
        <div
          className={`${styles.marker} ${styles.markerWhite}`}
          style={{ left: `${valueToPercent(settings.white)}%` }}
          onPointerDown={startDrag('white')}
        />
      </div>
    </div>
  );
}
