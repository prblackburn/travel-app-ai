import styles from './Button.module.css';

import type { ButtonHTMLAttributes, ReactNode, ComponentType } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  as?: any;
  to?: string;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  as: Component = 'button',
  ...props
}: ButtonProps): JSX.Element {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}


