import styles from './Input.module.css';

import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps): JSX.Element {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const classes = [styles.input, error ? styles.error : '', className].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={inputId} className={classes} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
