import type { InterpolationId } from '../../core/scaling/InterpolationAlgorithm';

export const ALGORITHM_LABELS: Record<InterpolationId, string> = {
  nearest: 'Ближайший соседгол',
  bilinear: 'Билинейная',
};

export const ALGORITHM_DESCRIPTIONS: Record<InterpolationId, string> = {
  nearest:
    'Берёт цвет ближайшего исходного пикселя. Самый быстрый способ, но при увеличении даёт зубчатые, пикселизированные края; при уменьшении может терять детали.',
  bilinear:
    'Взвешенно усредняет 4 ближайших пикселя. Даёт плавный результат при увеличении и уменьшении, но немного размывает резкие грани и мелкие детали.',
};
