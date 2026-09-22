import { useCallback, useState } from 'react';
import type { RasterImage } from '../core/image/RasterImage';
import { decodePngJpg } from '../core/codecs/pngJpgCodec';

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
      const image = await decodePngJpg(file);
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
