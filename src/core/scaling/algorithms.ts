import type { InterpolationFn, InterpolationId } from './InterpolationAlgorithm';
import { nearestNeighborResample } from './nearestNeighbor';
import { bilinearResample } from './bilinear';

export const INTERPOLATION_ALGORITHMS: Record<InterpolationId, InterpolationFn> = {
  nearest: nearestNeighborResample,
  bilinear: bilinearResample,
};

export const INTERPOLATION_IDS: InterpolationId[] = ['nearest', 'bilinear'];
export const DEFAULT_INTERPOLATION_ID: InterpolationId = 'bilinear';

export function getInterpolation(id: InterpolationId): InterpolationFn {
  return INTERPOLATION_ALGORITHMS[id] ?? INTERPOLATION_ALGORITHMS[DEFAULT_INTERPOLATION_ID];
}
