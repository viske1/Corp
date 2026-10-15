// Fixed full-viewport grid behind all content. Being fixed, it sits under the
// ProgressiveBlur layers (backdrop-filter) so it gets blurred at top/bottom,
// and a radial mask fades it out towards the viewport edges.
export function GridBackground() {
  return <div aria-hidden className="grid-background" />;
}
