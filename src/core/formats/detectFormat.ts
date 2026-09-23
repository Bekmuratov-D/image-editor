import type { SourceFormat } from '../image/RasterImage';

export async function detectFormat(file: File): Promise<SourceFormat> {
  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());

  if (header[0] === 0x47 && header[1] === 0x42 && header[2] === 0x37 && header[3] === 0x1d) {
    return 'gb7';
  }
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
    return 'png';
  }
  if (header[0] === 0xff && header[1] === 0xd8) {
    return 'jpg';
  }

  if (file.name.toLowerCase().endsWith('.gb7')) {
    return 'gb7';
  }
  if (file.type.includes('png')) {
    return 'png';
  }
  return 'jpg';
}
