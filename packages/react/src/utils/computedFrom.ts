import { Frame } from '@spring-keyframes/driver'
import { fromMatrix, FromMatrix } from '@spring-keyframes/matrix'

export function computedStyle(
  keys: string[],
  ref: React.MutableRefObject<Element | null>
): Frame {
  if (!ref.current) return {} as Frame

  return computedStyleForElement(keys, ref.current) || {}
}

export function computedStyleForElement(keys: string[], element?: Element) {
  if (!element) return
  const frame: Frame = {}
  const style = getComputedStyle(element)
  const frameTransforms =
    style.transform && style.transform !== 'none'
      ? fromMatrix(style.transform)
      : ({} as FromMatrix)

  // Couldn't do it.
  if (frameTransforms === null) return frame

  new Set(keys).forEach(key => {
    // @ts-ignore
    if (frameTransforms[key] !== undefined) {
      // @ts-ignore
      frame[key] = frameTransforms[key]
    } else if (key === 'scale') {
      frame[key] = frameTransforms.scaleX
    } else if (key === 'y') {
      frame[key] = frameTransforms.translateY
    } else if (key === 'x') {
      frame[key] = frameTransforms.translateX

      // Must come last as computedStyle has x and y keys that clash with transform shorthand.
    } else if (style[key as any]) {
      //@ts-ignore
      frame[key] = parseFloat(style[key as any])
    }
  })

  return frame
}
