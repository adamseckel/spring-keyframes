import { Frame, Property } from "@spring-keyframes/driver"
import { fromMatrix, Transforms } from "@spring-keyframes/matrix"

export function computedStyle(
  keys: Property[],
  ref: React.MutableRefObject<Element | null>
): Frame {
  if (!ref.current) return {} as Frame

  return computedStyleForElement(keys, ref.current)
}

function isTransform(value: Partial<Transforms>, key: string): key is keyof Transforms {
  return key in value
}

export function computedStyleForElement(keys: Property[], element: Element): Frame {
  const frame: Frame = {}
  const style = getComputedStyle(element)
  let frameTransforms: Partial<Transforms> = {}

  if (style.transform && style.transform !== "none")
    frameTransforms = fromMatrix(style.transform) || {}

  // Couldn't do it.
  if (frameTransforms === null) return frame

  for (const key of new Set(keys)) {
    if (isTransform(frameTransforms, key)) {
      frame[key] = frameTransforms[key]
    } else if (key === "scale") {
      frame[key] = frameTransforms.scaleX
    } else if (key === "y") {
      frame[key] = frameTransforms.translateY
    } else if (key === "x") {
      frame[key] = frameTransforms.translateX

      // Must come last as computedStyle has x and y keys that clash with transform shorthand.
    } else if (style[key as keyof CSSStyleDeclaration]) {
      // @ts-ignore
      frame[key] = parseFloat(style[key])
    }
  }

  return frame
}
