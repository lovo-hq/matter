/**
 * Pixel-style reset from the Figma icon set (component "icons", variant
 * "name16"): an arrow curling back on itself, on the set's 24-unit grid.
 * The path is the export's data, already on whole units. The panel draws
 * it at 16px, where its 2-unit cells land on the same 1.33px pitch as the
 * 16-unit glyphs beside it. The fill is swapped for currentColor so the
 * icon takes its color from the surrounding button.
 */
import type { SVGProps } from 'react';

export function ResetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 20H6V18H12V20ZM6 18H4V10H6V18ZM14 10H6V8H14V4H16V6H18V8H20V10H18V12H16V14H14V10Z" />
    </svg>
  );
}
