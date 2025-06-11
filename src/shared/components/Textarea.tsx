import styles from './Textarea.module.css';

import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = '',
  id,
  ...props
}: TextareaProps): JSX.Element {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const classes = [styles.textarea, error ? styles.error : '', className].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea id={textareaId} className={classes} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

