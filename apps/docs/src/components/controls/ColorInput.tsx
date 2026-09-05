'use client';

/**
 * A color prop's trigger: the 24px swatch and, beside it, the 80px box that
 * prints the stored color. Clicking either opens the popover holding the
 * three channel sliders and the text field; `stored` is already a canonical
 * oklch() string, so the trigger itself only has to paint and print it. The
 * printed string is the oklch() form on purpose: a hex code could not name a
 * wide-gamut color at all, and the popover is where the full value lives.
 * Inside a list row the visible label drops away, since the row already
 * names the control.
 *
 * This used to load the popover through `next/dynamic` with `ssr: false`,
 * because reaching the color math meant importing three/webgpu, which reads
 * `self` at module load. Both halves of that now come from three-free subpaths
 * (`@camp-dev/shaders/color` and `@camp-dev/shaders-react/gamut`), so it is a plain
 * import.
 */
import { Popover } from '@base-ui/react/popover';

import { ColorPopoverContents } from './ColorPopoverContents';
import { useListRowTrail } from './context';
import styles from './controls.module.css';
import type { PathInput } from './store';
import { usePropValue } from './useControl';

export interface ColorInputProps {
  path: PathInput;
  label: string;
}

export function ColorInput({ path, label }: ColorInputProps) {
  const stored = usePropValue<string>(path);
  const trail = useListRowTrail();
  const inRow = trail.length > 0;

  // "Color for stop 2" rather than a bare "Color" repeated on every row, so
  // a screen reader can tell the triggers apart.
  const name = inRow ? `${label} for ${trail.join(' > ')}` : label;

  return (
    <div className={styles.field}>
      {!inRow && <span className={styles.fieldLabel}>{label}</span>}
      <Popover.Root>
        <Popover.Trigger className={styles.swatchTrigger}>
          <span className={styles.srOnly}>{`Edit ${name}`}</span>
          <span aria-hidden="true" className={styles.swatch} style={{ background: stored }} />
          <span className={styles.swatchValue}>{stored}</span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={6}>
            <Popover.Popup className={styles.colorPopup}>
              <ColorPopoverContents label={name} path={path} />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
