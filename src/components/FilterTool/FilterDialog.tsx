import type { ChannelProfile } from '../../core/channels/channelProfile';
import type { EdgeMode } from '../../core/filters/types';
import { FILTER_PRESET_IDS, type FilterPresetId } from '../../core/filters/presets';
import type { useFilterDialog } from '../../hooks/useFilterDialog';
import { FILTER_PRESET_LABELS } from './filterPresetDescriptions';
import { Modal } from '../Modal/Modal';
import styles from './FilterDialog.module.css';

interface FilterDialogProps {
  profile: ChannelProfile | null;
  filters: ReturnType<typeof useFilterDialog>;
}

export function FilterDialog({ profile, filters }: FilterDialogProps) {
  return (
    <Modal isOpen={filters.isOpen} onClose={filters.cancel} className={styles.dialog}>
      <h2 className={styles.title}>Фильтр (свёртка 3×3)</h2>

      <div className={styles.row}>
        <span>Пресет</span>
        <select
          className={styles.select}
          value={filters.presetId}
          onChange={(e) => filters.selectPreset(e.target.value as FilterPresetId)}
        >
          {FILTER_PRESET_IDS.map((id) => (
            <option key={id} value={id}>
              {FILTER_PRESET_LABELS[id]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.kernelGrid}>
        {filters.kernel.map((value, index) => (
          <input
            key={index}
            type="number"
            step="0.0625"
            value={value}
            onChange={(e) => filters.setKernelCell(index, Number(e.target.value))}
          />
        ))}
      </div>

      <div className={styles.channels}>
        {profile?.isGrayscale ? (
          <label>
            <input
              type="checkbox"
              checked={filters.channels.r}
              onChange={(e) => filters.setGrayChannel(e.target.checked)}
            />{' '}
            Ч/Б
          </label>
        ) : (
          (['r', 'g', 'b'] as const).map((c) => (
            <label key={c}>
              <input
                type="checkbox"
                checked={filters.channels[c]}
                onChange={(e) => filters.setChannel(c, e.target.checked)}
              />{' '}
              {c.toUpperCase()}
            </label>
          ))
        )}
        {profile?.hasAlpha && (
          <label>
            <input
              type="checkbox"
              checked={filters.channels.alpha}
              onChange={(e) => filters.setChannel('alpha', e.target.checked)}
            />{' '}
            Alpha
          </label>
        )}
      </div>

      <div className={styles.row}>
        <span>Края</span>
        <select
          className={styles.select}
          value={filters.edgeMode}
          onChange={(e) => filters.setEdgeMode(e.target.value as EdgeMode)}
        >
          <option value="clamp">Растянуть край</option>
          <option value="black">Чёрным</option>
          <option value="white">Белым</option>
        </select>
      </div>

      <div className={styles.row}>
        <label>
          <input
            type="checkbox"
            checked={filters.livePreview}
            onChange={(e) => filters.setLivePreview(e.target.checked)}
          />{' '}
          Предпросмотр
        </label>
        {filters.isComputing && <span className={styles.hint}>вычисление…</span>}
      </div>

      <div className={styles.buttons}>
        <button type="button" className={styles.button} onClick={filters.reset} disabled={filters.isApplying}>
          Сброс
        </button>
        <button type="button" className={styles.button} onClick={filters.cancel} disabled={filters.isApplying}>
          Отмена
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={filters.apply}
          disabled={filters.isApplying}
        >
          {filters.isApplying ? 'Применяется…' : 'Применить'}
        </button>
      </div>
    </Modal>
  );
}
