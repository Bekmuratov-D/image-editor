import styles from './EyedropperButton.module.css';

interface EyedropperButtonProps {
  active: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export function EyedropperButton({ active, disabled, onToggle }: EyedropperButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${active ? styles.active : ''}`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={active}
    >
      💧 Пипетка
    </button>
  );
}
