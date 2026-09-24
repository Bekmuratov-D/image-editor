import styles from './ResizeButton.module.css';

interface ResizeButtonProps {
  disabled: boolean;
  onOpen: () => void;
}

export function ResizeButton({ disabled, onOpen }: ResizeButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onOpen} disabled={disabled}>
      Изменить размер
    </button>
  );
}
