import { Frame, Property } from '@spring-keyframes/driver'
import Unmatrix from './unmatrix'
const unmatrix = new Unmatrix()

type TransformProperty =
  | 'translateX'
  | 'translateY'
  | 'translateZ'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'

export function computedFrom(
  to: Frame,
  ref: React.MutableRefObject<Element | null>
): Frame {
  if (!ref.current) return {} as Frame

  // @TODO: Optionally infer unset from from element style.
  const frame: Frame = {}
  const style = getComputedStyle(ref.current)
  const frameTransforms: Partial<Record<TransformProperty, any>> =
    unmatrix.getTransform(style) || {}

  const keys = Object.keys(to) as Property[]

  keys.forEach(key => {
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
      frame[key] = parseFloat(style[key as any])
    }
  })
  return frame
}
