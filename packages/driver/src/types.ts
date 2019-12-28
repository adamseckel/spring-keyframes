import * as CSS from 'csstype'

export type Max = [number, number, number]
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

export type CSSProperty = keyof CSS.Properties
export type CSSFrame = [CSSProperty, number | string]
export type TransformFrame = [TransformProperty, number]
export type Property = CSSProperty | TransformProperty
export type Frame = { [K in Property]?: number | string }

export type FrameNumber = number

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
}
