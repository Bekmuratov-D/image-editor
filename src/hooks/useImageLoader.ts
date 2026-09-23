import { useCallback, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { decodePngJpg } from '../core/codecs/pngJpgCodec';
import { decodeGb7 } from '../core/codecs/gb7/gb7Decoder';
import { detectFormat } from '../core/formats/detectFormat';

interface ImageLoaderState {
  image: RasterImage | null;
  fileName: string | null;
  error: string | null;
  isLoading: boolean;
}

export function useImageLoader() {
  const [state, setState] = useState<ImageLoaderState>({
    image: null,
    fileName: null,
    error: null,
    isLoading: false,
  });

  const loadFile = useCallback(async (file: File) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const format = await detectFormat(file);
      const image = format === 'gb7' ? decodeGb7(await file.arrayBuffer()) : await decodePngJpg(file);
      setState({ image, fileName: file.name, error: null, isLoading: false });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Не удалось загрузить файл',
      }));
    }
  }, []);

  return { ...state, loadFile };
}
