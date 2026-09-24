import { useEffect, useMemo, useRef } from 'react';
import type { RasterImage } from '../../core/image/RasterImage';
import type { useLevelsDialog } from '../../hooks/useLevelsDialog';
import type { LevelsTargetId } from '../../core/levels/applyLevels';
import { computeHistogramForTarget } from '../../core/histogram/computeHistogram';
import { HistogramChart } from './HistogramChart';
import styles from './LevelsDialog.module.css';

interface LevelsDialogProps {
  image: RasterImage | null;
  levels: ReturnType<typeof useLevelsDialog>;
}

const TARGET_LABELS: Record<LevelsTargetId, string> = {
  master: 'Master',
  r: 'Red',
  g: 'Green',
  b: 'Blue',
  alpha: 'Alpha',
};

const TARGET_COLORS: Record<LevelsTargetId, string> = {
  master: '#3f3f46',
  r: '#ef4444',
  g: '#22c55e',
  b: '#3b82f6',
  alpha: '#3f3f46',
};

export function LevelsDialog({ image, levels }: LevelsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (levels.isOpen && !dialog.open) {
      dialog.showModal();
    }
    if (!levels.isOpen && dialog.open) {
      dialog.close();
    }
  }, [levels.isOpen]);

  const availableTargets: LevelsTargetId[] = useMemo(() => {
    const targets: LevelsTargetId[] = ['master', 'r', 'g', 'b'];
    if (image?.hasMask) {
      targets.push('alpha');
    }
    return targets;
  }, [image]);

  const histogram = useMemo(() => {
    if (!image) {
      return new Array(256).fill(0);
    }
    return computeHistogramForTarget(image.pixels, levels.selectedTarget);
  }, [image, levels.selectedTarget]);

  const settings = levels.state[levels.selectedTarget];

  return (
    <dialog ref={dialogRef} className={styles.dialog} onCancel={levels.cancel}>
      <h2 className={styles.title}>Уровни</h2>

      <div className={styles.row}>
        <span>Канал</span>
        <select
          className={styles.select}
          value={levels.selectedTarget}
          onChange={(e) => levels.setSelectedTarget(e.target.value as LevelsTargetId)}
        >
          {availableTargets.map((target) => (
            <option key={target} value={target}>
              {TARGET_LABELS[target]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <span>Гистограмма</span>
        <select
          className={styles.select}
          value={levels.histogramScale}
          onChange={(e) => levels.setHistogramScale(e.target.value as 'linear' | 'log')}
        >
          <option value="linear">Линейная</option>
          <option value="log">Логарифмическая</option>
        </select>
      </div>

      <HistogramChart histogram={histogram} scale={levels.histogramScale} color={TARGET_COLORS[levels.selectedTarget]} />

      <div className={styles.inputsRow}>
        <label className={styles.field}>
          Чёрная точка
          <input
            type="number"
            min={0}
            max={255}
            value={settings.black}
            onChange={(e) =>
              levels.updateTarget(levels.selectedTarget, { ...settings, black: Number(e.target.value) })
            }
          />
        </label>
        <label className={styles.field}>
          Гамма
          <input
            type="number"
            min={0.1}
            max={9.9}
            step={0.1}
            value={settings.gamma}
            onChange={(e) =>
              levels.updateTarget(levels.selectedTarget, { ...settings, gamma: Number(e.target.value) })
            }
          />
        </label>
        <label className={styles.field}>
          Белая точка
          <input
            type="number"
            min={0}
            max={255}
            value={settings.white}
            onChange={(e) =>
              levels.updateTarget(levels.selectedTarget, { ...settings, white: Number(e.target.value) })
            }
          />
        </label>
      </div>

      <div className={styles.row}>
        <label>
          <input
            type="checkbox"
            checked={levels.livePreview}
            onChange={(e) => levels.setLivePreview(e.target.checked)}
          />{' '}
          Предпросмотр
        </label>
      </div>

      <div className={styles.buttons}>
        <button type="button" className={styles.button} onClick={levels.reset}>
          Сброс
        </button>
        <button type="button" className={styles.button} onClick={levels.cancel}>
          Отмена
        </button>
        <button type="button" className={`${styles.button} ${styles.buttonPrimary}`} onClick={levels.apply}>
          Применить
        </button>
      </div>
    </dialog>
  );
}
