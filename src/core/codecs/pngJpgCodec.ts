import type { RasterImage } from '../image/RasterImage';

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
    img.src = src;
  });
}

export async function decodePngJpg(file: File): Promise<RasterImage> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D недоступен');
    }
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return {
      width,
      height,
      pixels: data,
      bitDepth: 8,
      hasMask: true,
      sourceFormat: file.type.includes('png') ? 'png' : 'jpg',
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function encodePngJpg(image: RasterImage, mime: 'image/png' | 'image/jpeg'): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return Promise.reject(new Error('Canvas 2D недоступен'));
  }
  ctx.putImageData(new ImageData(image.pixels, image.width, image.height), 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Не удалось закодировать изображение'));
      }
    }, mime);
  });
}
