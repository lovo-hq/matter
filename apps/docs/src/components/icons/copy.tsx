/**
 * Pixel-style copy glyph from the Figma icon set (component "icons"): two
 * overlapping sheets on a 12-unit grid, the size the color picker's copy
 * button draws it at. The path is the export's data, already on whole
 * units. The fill is swapped for currentColor so the icon takes its color
 * from the surrounding button.
 */
import type { SVGProps } from 'react';

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 11H4V10H10V11ZM4 10H3V9H2V8H3V4H4V10ZM11 10H10V4H11V10ZM2 8H1V2H2V8ZM9 3H10V4H4V3H8V2H9V3ZM8 2H2V1H8V2Z" />
    </svg>
  );
}
