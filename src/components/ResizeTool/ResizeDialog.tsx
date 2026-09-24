import type { RasterImage } from '../../core/image/RasterImage';
import type { useResizeDialog, ResizeUnit } from '../../hooks/useResizeDialog';
import type { InterpolationId } from '../../core/scaling/InterpolationAlgorithm';
import { INTERPOLATION_IDS } from '../../core/scaling/algorithms';
import { ALGORITHM_DESCRIPTIONS, ALGORITHM_LABELS } from './algorithmDescriptions';
import { Modal } from '../Modal/Modal';
import styles from './ResizeDialog.module.css';

interface ResizeDialogProps {
  image: RasterImage | null;
  resize: ReturnType<typeof useResizeDialog>;
}

export function ResizeDialog({ resize }: ResizeDialogProps) {
  const unitLabel = resize.unit === 'percent' ? '%' : 'px';

  return (
    <Modal isOpen={resize.isOpen} onClose={resize.cancel} className={styles.dialog}>
      <h2 className={styles.title}>Изменить размер</h2>

      <div className={styles.megapixels}>
        {resize.megapixelsBefore.toFixed(2)} МП → {resize.megapixelsAfter.toFixed(2)} МП
      </div>

      <div className={styles.row}>
        <span>Единицы</span>
        <select
          className={styles.select}
          value={resize.unit}
          onChange={(e) => resize.setUnit(e.target.value as ResizeUnit)}
        >
          <option value="pixels">Пиксели</option>
          <option value="percent">Проценты</option>
        </select>
      </div>

      <div className={styles.fieldsRow}>
        <label className={styles.field}>
          Ширина ({unitLabel})
          <input
            type="number"
            value={Math.round(resize.widthField * 100) / 100}
            onChange={(e) => resize.setWidthField(Number(e.target.value))}
          />
        </label>
        <label className={styles.field}>
          Высота ({unitLabel})
          <input
            type="number"
            value={Math.round(resize.heightField * 100) / 100}
            onChange={(e) => resize.setHeightField(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.row}>
        <label>
          <input
            type="checkbox"
            checked={resize.lockAspect}
            onChange={(e) => resize.setLockAspect(e.target.checked)}
          />{' '}
          Сохранять пропорции
        </label>
      </div>

      <div className={styles.row}>
        <span>Алгоритм</span>
        <select
          className={styles.select}
          value={resize.algorithmId}
          title={ALGORITHM_DESCRIPTIONS[resize.algorithmId]}
          onChange={(e) => resize.setAlgorithmId(e.target.value as InterpolationId)}
        >
          {INTERPOLATION_IDS.map((id) => (
            <option key={id} value={id}>
              {ALGORITHM_LABELS[id]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.description}>{ALGORITHM_DESCRIPTIONS[resize.algorithmId]}</div>

      <div className={styles.buttons}>
        <button type="button" className={styles.button} onClick={resize.cancel}>
          Отмена
        </button>
        <button type="button" className={`${styles.button} ${styles.buttonPrimary}`} onClick={resize.apply}>
          Применить
        </button>
      </div>
    </Modal>
  );
}
