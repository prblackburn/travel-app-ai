import styles from './Layout.module.css';

import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps): JSX.Element {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Travel Planner</h1>
          {title && <h2 className={styles.pageTitle}>{title}</h2>}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}


