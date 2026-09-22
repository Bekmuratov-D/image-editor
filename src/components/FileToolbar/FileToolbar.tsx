import { useRef, type ChangeEvent } from 'react';
import styles from './FileToolbar.module.css';

interface FileToolbarProps {
  onFileSelected: (file: File) => void;
}

export function FileToolbar({ onFileSelected }: FileToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    event.target.value = '';
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
    </div>
  );
}
