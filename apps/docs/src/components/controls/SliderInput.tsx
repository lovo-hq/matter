'use client';

/**
 * A number prop: a draggable track plus an editable readout. Base UI's Slider
 * handles pointer capture, arrow-key stepping, Page Up/Down (largeStep), and
 * the ARIA value attributes; NumberField handles typed entry and clamping.
 * onValueChange fires continuously through a drag, which is fine here — numeric
 * props travel through stable uniform nodes on the GPU side and cost nothing per frame.
 */
import { NumberField } from '@base-ui/react/number-field';
import { Slider } from '@base-ui/react/slider';

import styles from './controls.module.css';
import type { PathInput } from './store';
import { usePropValue, useSetProp } from './useControl';

export interface SliderInputProps {
  /** Where this control reads and writes in the page's params. */
  path: PathInput;
  /** Visible label, in everyday words. */
  label: string;
  min: number;
  max: number;
  step: number;
  /** Jump size for Page Up/Down. Defaults to ten steps. */
  largeStep?: number;
  /** Most decimal places the readout shows. Defaults to what `step` implies. */
  decimals?: number;
}

/** 0.05 -> 2, 1 -> 0. Matches the readout's decimal places to what `step` implies. */
const decimalsForStep = (step: number) =>
  step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));

export function SliderInput({
  path,
  label,
  min,
  max,
  step,
  largeStep,
  decimals,
}: SliderInputProps) {
  const value = usePropValue<number>(path);
  const setProp = useSetProp();

  // A ceiling only, no floor: the 40px readout shows 1 as "1" and 0.35 as
  // "0.35", the way the mock writes them, rather than padding every value to
  // "1.00". Typed entry still rounds to the same number of places.
  const fractionDigits = decimals ?? decimalsForStep(step);
  const format: Intl.NumberFormatOptions = { maximumFractionDigits: fractionDigits };

  const commit = (next: number) => {
    setProp(path, Math.min(max, Math.max(min, next)));
  };

  return (
    <div className={styles.field}>
      <Slider.Root
        className={styles.sliderRoot}
        format={format}
        largeStep={largeStep ?? step * 10}
        max={max}
        min={min}
        onValueChange={commit}
        step={step}
        // Keeps the whole 4px thumb inside the track at 0 and at max, instead
        // of centering it on the edge where half of it would be clipped.
        thumbAlignment="edge"
        value={value}
      >
        <Slider.Label className={styles.fieldLabel}>{label}</Slider.Label>
        <Slider.Control className={styles.sliderControl}>
          <Slider.Track className={styles.sliderTrack}>
            <Slider.Indicator className={styles.sliderIndicator} />
            <Slider.Thumb className={styles.sliderThumb} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <NumberField.Root
        format={format}
        max={max}
        min={min}
        onValueChange={(next) => {
          if (next !== null) commit(next);
        }}
        step={step}
        value={value}
      >
        <NumberField.Group>
          <NumberField.Input aria-label={`${label} value`} className={styles.numberInput} />
        </NumberField.Group>
      </NumberField.Root>
    </div>
  );
}
