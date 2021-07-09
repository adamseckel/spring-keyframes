export default function computedStyle(element: Element) {
  // X and Y are svg props that we want to ignore so that we don't treat them as
  // our short hand transforms.
  return Object.assign({}, window.getComputedStyle(element), { x: undefined, y: undefined })
}

const CSSStyleDeclarationKey = "getPropertyValue"
export function isCSSStyleDeclaration(value: object): value is CSSStyleDeclaration {
  return CSSStyleDeclarationKey in value
}
