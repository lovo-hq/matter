/**
 * Pixel-style minus from the Figma icon set (component "icons"), the mock's
 * "remove this row" glyph. The path is the export's data with its
 * coordinates rounded to two decimals, exact to a hundredth of a unit on
 * the 16-unit grid. The fill is swapped for currentColor so the icon takes
 * its color from the surrounding button.
 */
import type { SVGProps } from 'react';

export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2.67 7.33H13.33V8.67H2.67V7.33Z" />
    </svg>
  );
}
