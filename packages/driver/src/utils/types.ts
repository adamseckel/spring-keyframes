import * as CSS from 'csstype'
import { Transforms } from './createTransformString'

export type FrameNumber = number
type FrameValue = number
type FrameVelocity = number
type IsMax = boolean
export type Max = [FrameValue, FrameNumber, FrameVelocity, IsMax]
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
type ScaleProperty = 'scale' | 'scaleX' | 'scaleY'
export type CSSProperty = keyof Omit<CSS.Properties, 'transition'>
export type CSSFrame = [CSSProperty, number | string]
export type TransformFrame = [TransformProperty, number]
export type ScaleFrame = [ScaleProperty, number]
export type Property = CSSProperty | TransformProperty
export type Frame = Omit<
  React.CSSProperties,
  'scale' | 'rotate' | 'transition'
> &
  Transforms

export type Keyframe = [
  /** Frame */
  FrameNumber,
  /** value */
  CSSFrame[]
]

export type Delta =
  | {
      scaleX: number
      scaleY: number
    }
  | number

export type InvertedFrame = Partial<Record<ScaleProperty, number>>

export interface InvertedAnimation {
  from: InvertedFrame
  to: InvertedFrame
}

export interface Options {
  stiffness?: number
  damping?: number
  mass?: number
  precision?: number
  velocity?: number
  tweenedProps?: Property[]
  withInvertedScale?: boolean
  invertedAnimation?: InvertedAnimation
}
