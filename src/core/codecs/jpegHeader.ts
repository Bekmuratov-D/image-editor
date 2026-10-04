export interface JpegFrameInfo {
  // Бит на компонент (8 у обычного JPEG, 12 у редкого расширенного).
  precision: number;
  // 1 — оттенки серого, 3 — YCbCr (цветной), 4 — CMYK.
  components: number;
}

const SOI = 0xd8;
const EOI = 0xd9;
const SOS = 0xda;

// SOF0..SOF15, кроме DHT (C4), JPG (C8) и DAC (CC), которые не являются кадрами.
function isStartOfFrame(marker: number): boolean {
  return marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
}

function isStandaloneMarker(marker: number): boolean {
  return marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7);
}

// Идёт по сегментам JPEG до заголовка кадра SOF и читает из него точность и число компонент.
export function readJpegFrameInfo(buffer: ArrayBuffer): JpegFrameInfo | null {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== SOI) {
    return null;
  }

  let offset = 2;
  while (offset + 1 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      return null;
    }
    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (isStandaloneMarker(marker)) {
      offset += 2;
      continue;
    }
    if (marker === EOI || marker === SOS) {
      return null;
    }
    if (offset + 3 >= bytes.length) {
      return null;
    }
    if (isStartOfFrame(marker)) {
      if (offset + 9 >= bytes.length) {
        return null;
      }
      return { precision: bytes[offset + 4], components: bytes[offset + 9] };
    }
    const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    offset += 2 + segmentLength;
  }
  return null;
}
