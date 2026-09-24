import styles from './LevelsButton.module.css';

interface LevelsButtonProps {
  disabled: boolean;
  onOpen: () => void;
}

export function LevelsButton({ disabled, onOpen }: LevelsButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onOpen} disabled={disabled}>
      Уровни
    </button>
  );
}
