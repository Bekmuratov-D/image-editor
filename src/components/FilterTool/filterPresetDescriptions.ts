import type { FilterPresetId } from '../../core/filters/presets';

export const FILTER_PRESET_LABELS: Record<FilterPresetId, string> = {
  identity: 'Тождественное отображение',
  sharpen: 'Повышение резкости',
  gaussian: 'Фильтр Гаусса (3×3)',
  boxBlur: 'Прямоугольное размытие',
  prewittGx: 'Прюитт (вертикальные границы)',
  prewittGy: 'Прюитт (горизонтальные границы)',
};
