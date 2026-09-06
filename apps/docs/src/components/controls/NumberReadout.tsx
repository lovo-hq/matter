'use client';

/**
 * The small box that shows a number and takes a typed one: the readout
 * beside every slider, and the whole of NumberInput. Base UI's NumberField
 * handles typed entry, arrow-key stepping, and clamping to min and max. This
 * wraps it in the mock's 40px box and, when a unit is given, widens the box
 * and sets the unit beside the digits in gray so "35 %" reads as one value.
 *
 * The box is also a scrub area: press and drag sideways to slide the value,
 * the way Figma's number fields work. A plain click still lands in the
 * input to type, because Base UI focuses the input on pointer-down before
 * it decides whether a drag follows. While scrubbing, the real pointer is
 * locked (so a drag can run past the screen edge) and Base UI draws the
 * virtual cursor below in its place.
 */
import { useRef } from 'react';

import { NumberField } from '@base-ui/react/number-field';

import { CaretRightIcon } from '@/components/icons/caret-right';

import styles from './controls.module.css';

export interface NumberReadoutProps {
  /** Accessible name for the input, e.g. "Speed value". */
  ariaLabel: string;
  value: number;
  /** Fires with the typed, stepped, or scrubbed value once NumberField has clamped it. */
  onCommit: (next: number) => void;
  min: number;
  max: number;
  step: number;
  /** Jump size for Page Up/Down and for a shift-drag. */
  largeStep?: number;
  /** Most decimal places shown and accepted. */
  decimals: number;
  /** Text after the digits, e.g. "%". */
  unit?: string;
}

/**
 * Pixels of drag per step. 2 is Base UI's default; smaller scrubs faster.
 * A 0..3 slider with a 0.01 step takes 600px of drag end to end at 2, which
 * is precise on purpose: the slider beside it is the coarse control.
 */
const PIXELS_PER_STEP = 2;

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

  // Where the last press landed, so a release can tell a click from a drag.
  const pressRef = useRef<{ x: number; y: number } | null>(null);

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
      <NumberField.ScrubArea
        className={boxClassName}
        direction="horizontal"
        pixelSensitivity={PIXELS_PER_STEP}
      >
        {/* A click selects the value so the next keystroke replaces it. Two
            guards keep that from fighting the scrub. Any selection collapses
            on pointer-down, because a mouse-down on selected text starts a
            native text drag that cancels the pointer events a scrub needs,
            which is what broke the second drag after a click. And the select
            runs on click rather than focus, both because Base UI's own focus
            handler parks the caret at the end and runs last, and because a
            release that travelled is a scrub, not a click, and must not
            select. */}
        <NumberField.Input
          aria-label={ariaLabel}
          className={styles.numberInput}
          onClick={(event) => {
            const press = pressRef.current;
            const travelled =
              press !== null &&
              (Math.abs(event.clientX - press.x) > 2 || Math.abs(event.clientY - press.y) > 2);

            if (!travelled) event.currentTarget.select();
          }}
          onPointerDown={(event) => {
            const input = event.currentTarget;

            pressRef.current = { x: event.clientX, y: event.clientY };
            input.setSelectionRange(input.value.length, input.value.length);
          }}
        />
        {unit !== undefined && (
          <span aria-hidden="true" className={styles.numberUnit}>
            {unit}
          </span>
        )}
        {/* Two carets from the icon set, one mirrored, standing in for the
            ew-resize arrow while the real pointer is locked. */}
        <NumberField.ScrubAreaCursor className={styles.scrubCursor}>
          <CaretRightIcon className={styles.scrubCursorLeft} height="12" width="12" />
          <CaretRightIcon height="12" width="12" />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>
    </NumberField.Root>
  );
}
