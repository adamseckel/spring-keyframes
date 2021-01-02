export default function computedStyle(element: Element) {
  // X and Y are svg props that we want to ignore so that we don't treat them as
  // our short hand transforms.
  return Object.assign({}, window.getComputedStyle(element), { x: undefined, y: undefined })
}
