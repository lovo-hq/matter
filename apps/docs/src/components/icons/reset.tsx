/**
 * Pixel-style reset arrow drawn on the same 16-unit grid as the Figma icon
 * set's chevron: an open ring with a corner arrowhead at the top right, the
 * usual "back to how it was" glyph. The Figma file has no reset icon of its
 * own, so this one is hand-placed cell by cell (12 cells of 4/3 units each,
 * coordinates rounded to two decimals). Swap the path for the set's glyph if
 * one is added. The fill is currentColor so the button decides the color.
 */
import type { SVGProps } from 'react';

export function ResetIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5.33 2.67H8V4H5.33V2.67ZM8 2.67H9.33V4H8V2.67ZM9.33 2.67H12V4H9.33V2.67ZM4 4H5.33V5.33H4V4ZM10.67 4H12V5.33H10.67V4ZM2.67 5.33H4V10.67H2.67V5.33ZM10.67 5.33H12V6.67H10.67V5.33ZM12 5.33H13.33V6.67H12V5.33ZM12 6.67H13.33V8H12V6.67ZM4 10.67H5.33V12H4V10.67ZM5.33 12H10.67V13.33H5.33V12ZM10.67 10.67H12V12H10.67V10.67ZM12 8H13.33V10.67H12V8Z" />
    </svg>
  );
}
