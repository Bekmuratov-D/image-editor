export const MIN_ZOOM = 12;
export const MAX_ZOOM = 300;
const MARGIN_PX = 50;

export function clampZoom(percent: number): number {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, percent));
}

export function computeAutoFitZoom(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
): number {
  const usableWidth = containerWidth - MARGIN_PX * 2;
  const usableHeight = containerHeight - MARGIN_PX * 2;

  if (usableWidth <= 0 || usableHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return 100;
  }

  const fitPercent = Math.min(usableWidth / imageWidth, usableHeight / imageHeight) * 100;
  return clampZoom(fitPercent);
}
