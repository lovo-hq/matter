'use client';

/**
 * The two-column frame every component demo page uses: shader on the left in
 * a column capped at 4xl, controls on the right in a sticky 2xs column that
 * scrolls on its own once the panel outgrows the viewport, and stacks below
 * the shader under 1024px. A fade over the column's bottom edge says there
 * are more controls below; it only shows while there is genuinely something
 * left to scroll to, so a short panel never has its last row dimmed. The
 * shader child keeps its own [data-shader-demo] wrapper, which is what the
 * Playwright visual suite sizes against.
 */
import { type ReactNode, useEffect, useRef } from 'react';

import styles from './demo-layout.module.css';

/** Within this many px of the bottom counts as "at the end" and hides the fade. */
const END_THRESHOLD = 8;

export function DemoLayout({ controls, children }: { controls: ReactNode; children: ReactNode }) {
  const columnRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Keeps data-has-more on the column in step with what is left to scroll.
  // Written straight to the DOM rather than through state: the answer only
  // changes the fade's opacity, so a re-render of the whole panel for it
  // would be wasted. Re-measured on scroll and on any size change of the
  // scroller or the panel inside it (a list row added, a window resize).
  useEffect(() => {
    const column = columnRef.current;
    const scroller = scrollerRef.current;

    if (column === null || scroller === null) return;

    const measure = () => {
      const remaining = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;

      if (remaining > END_THRESHOLD) {
        column.dataset.hasMore = '';
      } else {
        delete column.dataset.hasMore;
      }
    };

    measure();
    scroller.addEventListener('scroll', measure, { passive: true });

    const observer = new ResizeObserver(measure);

    observer.observe(scroller);

    if (scroller.firstElementChild !== null) observer.observe(scroller.firstElementChild);

    return () => {
      scroller.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.layout}>
      <div>{children}</div>
      <aside className={styles.controls} ref={columnRef}>
        <div className={styles.scroller} ref={scrollerRef}>
          {controls}
        </div>
        <div aria-hidden="true" className={styles.fade} />
      </aside>
    </div>
  );
}
