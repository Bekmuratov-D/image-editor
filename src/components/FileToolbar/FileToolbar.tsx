import { useRef, useState, type ChangeEvent } from 'react';
import type { RasterImage, SourceFormat } from '../../core/image/RasterImage';
import { encodePngJpg } from '../../core/codecs/pngJpgCodec';
import { encodeGb7 } from '../../core/codecs/gb7/gb7Encoder';
import { downloadBytes } from '../../core/download';
import styles from './FileToolbar.module.css';

interface FileToolbarProps {
  image: RasterImage | null;
  onFileSelected: (file: File) => void;
}

const EXTENSION: Record<SourceFormat, string> = { png: 'png', jpg: 'jpg', gb7: 'gb7' };

export function FileToolbar({ image, onFileSelected }: FileToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [saveFormat, setSaveFormat] = useState<SourceFormat>('png');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    event.target.value = '';
  };

  const handleSave = async () => {
    if (!image) {
      return;
    }
    const fileName = `image.${EXTENSION[saveFormat]}`;

    if (saveFormat === 'gb7') {
      downloadBytes(encodeGb7(image), fileName);
      return;
    }

    const blob = await encodePngJpg(image, saveFormat === 'png' ? 'image/png' : 'image/jpeg');
    downloadBytes(blob, fileName);
  };

  return (
    <div className={styles.toolbar}>
      <button type="button" className={styles.button} onClick={() => inputRef.current?.click()}>
        Открыть изображение
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.gb7"
        className={styles.hiddenInput}
        onChange={handleChange}
      />

      <select
        className={styles.select}
        value={saveFormat}
        onChange={(e) => setSaveFormat(e.target.value as SourceFormat)}
      >
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
        <option value="gb7">GB7</option>
      </select>
      <button type="button" className={styles.button} onClick={handleSave} disabled={!image}>
        Сохранить
      </button>
    </div>
  );
}
