/**
 * How many decimal places a readout shows, derived from its step so a
 * 0.01-step field prints two places and a whole-number field prints none.
 * Shared by SliderInput and NumberInput; kept out of the component files so
 * Fast Refresh can preserve their state.
 */

/** 0.05 -> 2, 1 -> 0. Matches a readout's decimal places to what its `step` implies. */
export const decimalsForStep = (step: number) =>
  step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));
