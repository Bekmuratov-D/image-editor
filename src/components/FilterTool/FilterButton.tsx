import styles from './FilterButton.module.css';

interface FilterButtonProps {
  disabled: boolean;
  onOpen: () => void;
}

export function FilterButton({ disabled, onOpen }: FilterButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onOpen} disabled={disabled}>
      Фильтр
    </button>
  );
}
