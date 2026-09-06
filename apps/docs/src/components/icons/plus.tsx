/**
 * Pixel-style plus from the Figma icon set (component "icons"), the mock's
 * "add a row" glyph. The path is the export's data with its coordinates
 * rounded to two decimals, which is exact to a hundredth of a unit on the
 * 16-unit grid and well below anything visible. The fill is swapped for
 * currentColor so the icon takes its color from the surrounding button.
 */
import type { SVGProps } from 'react';

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8.67 7.33H13.33V8.67H8.67V13.33H7.33V8.67H2.67V7.33H7.33V2.67H8.67V7.33Z" />
    </svg>
  );
}
