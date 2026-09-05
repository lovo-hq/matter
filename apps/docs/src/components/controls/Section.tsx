/**
 * A titled group of controls ("Motion", "Shape", "Mixing"). A div with
 * role="group" named by its header rather than a fieldset and legend: a
 * legend is always drawn on the fieldset's top border edge, which fights the
 * rule and padding the mock puts above every group. Screen readers announce
 * the group's name when focus enters it either way.
 */
import { type ReactNode, useId } from 'react';

import styles from './controls.module.css';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  const headingId = useId();

  return (
    <div aria-labelledby={headingId} className={styles.section} role="group">
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle} id={headingId}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}
