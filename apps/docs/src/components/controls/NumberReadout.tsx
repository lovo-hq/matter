'use client';

/**
 * The small box that shows a number and takes a typed one: the readout
 * beside every slider, and the whole of NumberInput. Base UI's NumberField
 * handles typed entry, arrow-key stepping, and clamping to min and max. This
 * wraps it in the mock's 40px box and, when a unit is given, widens the box
 * and sets the unit beside the digits in gray so "35 %" reads as one value.
 */
import { NumberField } from '@base-ui/react/number-field';

import styles from './controls.module.css';

export interface NumberReadoutProps {
  /** Accessible name for the input, e.g. "Speed value". */
  ariaLabel: string;
  value: number;
  /** Fires with the typed or stepped value once NumberField has clamped it. */
  onCommit: (next: number) => void;
  min: number;
  max: number;
  step: number;
  /** Jump size for Page Up/Down. */
  largeStep?: number;
  /** Most decimal places shown and accepted. */
  decimals: number;
  /** Text after the digits, e.g. "%". */
  unit?: string;
}

/** 0.05 -> 2, 1 -> 0. Matches a readout's decimal places to what its `step` implies. */
export const decimalsForStep = (step: number) =>
  step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));

export function NumberReadout({
  ariaLabel,
  value,
  onCommit,
  min,
  max,
  step,
  largeStep,
  decimals,
  unit,
}: NumberReadoutProps) {
  // A ceiling only, no floor: the box shows 1 as "1" and 0.35 as "0.35", the
  // way the mock writes them, rather than padding every value to "1.00".
  const format: Intl.NumberFormatOptions = { maximumFractionDigits: decimals };
  const boxClassName =
    unit === undefined ? styles.numberBox : `${styles.numberBox} ${styles.numberBoxWithUnit}`;

  return (
    <NumberField.Root
      format={format}
      largeStep={largeStep}
      max={max}
      min={min}
      onValueChange={(next) => {
        if (next !== null) onCommit(next);
      }}
      step={step}
      value={value}
    >
      <NumberField.Group className={boxClassName}>
        <NumberField.Input aria-label={ariaLabel} className={styles.numberInput} />
        {unit !== undefined && (
          <span aria-hidden="true" className={styles.numberUnit}>
            {unit}
          </span>
        )}
      </NumberField.Group>
    </NumberField.Root>
  );
}
