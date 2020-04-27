import * as CSS from 'csstype'

export type FrameNumber = number
type FrameValue = number
type FrameVelocity = number
export type Max = [FrameValue, FrameNumber, FrameVelocity]
export type Maxes = Max[]
export type TransformProperty =
  | 'x'
  | 'y'
  | 'z'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'

export type Matrix = 'matrix'

export type CSSProperty = keyof Omit<CSS.Properties, 'transition'>
export type CSSFrame = [CSSProperty, number | string]
export type TransformFrame = [TransformProperty, number]
export type Property = CSSProperty | TransformProperty | Matrix
export type Frame = { [K in Property]?: number | string | number[] }

export type Keyframe = [
  /** Frame */
  FrameNumber,
  /** value */
  CSSFrame[]
]

export interface Options {
  stiffness?: number
  damping?: number
  mass?: number
  precision?: number
  velocity?: number
  tweenedProps?: Property[]
  withInvertedScale?: boolean
  withEveryFrame?: boolean
}
