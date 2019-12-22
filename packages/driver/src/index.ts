import * as CSS from 'csstype'
import { spring } from './spring'
import { interpolate } from './interpolate'
import { playtimeToVelocity } from './playtimeToVelocity'

export const msPerFrame = 1000 / 60
const EASE = 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'

type Max = [number, number, number]
export type Maxes = Max[]
type TransformProperty = 'scale' | 'x' | 'y' | 'rotate' | 'scaleX' | 'scaleY'
type CSSProperty = keyof CSS.Properties
type CSSFrame = [CSSProperty, number | string]
type TransformFrame = [TransformProperty, number]
export type Property = CSSProperty | TransformProperty
export type Frame = { [K in Property]?: number | string }

const transforms = ['scale', 'x', 'y', 'rotate', 'scaleX', 'scaleY']
const unitless = [
  'opacity',
  'transform',
  'color',
  'background',
  'backgroundColor',
]
const tweenedProperties: Property[] = [
  'color',
  'backgroundColor',
  'background',
  'opacity',
]

type FrameNumber = number

type Keyframe = [
  /** Frame */
  FrameNumber,
  /** value */
  CSSFrame[]
]

function convertMaxesToKeyframes(
  maxes: Maxes,
  toFrame: (value: number) => number,
  from: Frame,
  to: Frame
): Keyframe[] {
  return maxes.map(([value, index]) => [
    toFrame(index),
    toValue(value, from, to),
  ])
}

function toValue(value: number, from: Frame, to: Frame): CSSFrame[] {
  let style: CSSFrame[] = []
  let transform: TransformFrame[] = []
  const keys = Object.keys(from) as Property[]

  keys.forEach(key => {
    if (transforms.includes(key)) {
      transform.push([
        key,
        interpolate(1, 0, from[key] as number, to[key] as number)(value),
      ] as TransformFrame)
    } else {
      style.push([
        key,
        interpolate(1, 0, from[key] as number, to[key] as number)(value),
      ] as CSSFrame)
    }
  })

  if (transform.length > 0) {
    style.push(['transform', createTransformBlock(transform)])
  }

  return style
}

function createTransformBlock(transforms: TransformFrame[]): string {
  const props: Partial<Record<TransformProperty, number>> = {}

  transforms.forEach(([key, value]) => {
    props[key] = value
  })

  const { x, y, scale, rotate, scaleX, scaleY } = props

  const block = []

  // @TODO: Probably better to use a matrix3d here.
  if (x !== undefined || y !== undefined) {
    block.push(`translate3d(${x || 0}px, ${y || 0}px, 0px)`)
  }
  if (rotate !== undefined) {
    block.push(`rotate3d(0, 0, 1, ${rotate}deg)`)
  }
  if (scale !== undefined) {
    block.push(`scale3d(${scale}, ${scale}, 1)`)
  }
  if (scaleX !== undefined || scaleY !== undefined) {
    block.push(
      `scale3d(${scaleX !== undefined ? scaleX : 1}, ${
        scaleY !== undefined ? scaleY : 1
      }, 1)`
    )
  }

  return block.join(' ')
}

// function transformProp(string: string) {
//   string
//     .replace(/([A-Z])([A-Z])/g, '$1-$2')
//     .replace(/([a-z])([A-Z])/g, '$1-$2')
//     .replace(/[\s_]+/g, '-')
//     .toLowerCase()
// }

function createBlock(value: CSSFrame[]) {
  return value
    .map(
      ([prop, val]) => `${camelCaseToDash(prop)}: ${val}${unitForProp(prop)}`
    )
    .join('; ')
}

function camelCaseToDash(property: string) {
  return property.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

function unitForProp(prop: Property) {
  return unitless.includes(prop) ? '' : 'px'
}

function convertKeyframesToCSS(keyframes: Keyframe[]): string {
  return keyframes
    .map(([frame, value]) => `${frame}% {${createBlock(value)};}`)
    .join('\n ')
}

export interface Options {
  stiffness?: number
  damping?: number
  mass?: number
  precision?: number
  velocity?: number
}

const defaults = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  precision: 0.01,
  velocity: 0,
}

function createTweenedKeyframes(from: CSSFrame[], to: CSSFrame[]): Keyframe[] {
  return [[0, from], [100, to]]
}

function breakupFrame(frame: Frame): [CSSFrame[], Frame] {
  let tweened: CSSFrame[] = []
  let sprung: Frame = {}

  const keys = Object.keys(frame) as Property[]

  keys.forEach(key => {
    if (tweenedProperties.includes(key)) {
      // @ts-ignore
      tweened.push([key, frame[key]])
    } else {
      sprung[key] = frame[key]
    }
  })

  return [tweened, sprung]
}

export default function main(
  from: Frame,
  to: Frame,
  options?: Options
): [string[], string, string, (frame: number) => number] {
  const optionsWithDefaults = {
    ...defaults,
    ...options,
  }

  const animations: string[] = []

  const [maxes, lastFrame] = spring(optionsWithDefaults)

  // Interpolate between keyframe values of 0 - 100 and frame indexes of 0 - x where x is the lastFrame.
  const toFrame = interpolate(0, lastFrame, 0, 100)
  const toPreciseFrame = interpolate(0, lastFrame, 0, 100, v => v, 1)

  // Separate Tweened and Sprung properties.
  const [tFrom, sFrom] = breakupFrame(from)
  const [tTo, sTo] = breakupFrame(to)

  // Generate keyframe, styled value tuples.
  if (Object.keys(sFrom).length || Object.keys(sTo).length) {
    const springKeyframes = convertMaxesToKeyframes(maxes, toFrame, sFrom, sTo)
    animations.push(convertKeyframesToCSS(springKeyframes))
  }
  if (tFrom.length || tTo.length) {
    const tweenedKeyframes = createTweenedKeyframes(tFrom, tTo)
    animations.push(convertKeyframesToCSS(tweenedKeyframes))
  }

  // Calculate duration based on the number of frames.
  const duration = Math.round(msPerFrame * lastFrame * 100) / 100 + 'ms'

  // Create a function to return a frame for a play time.
  // Enables interrupting animations by creating new ones that start from the current velocity and frame.
  return [animations, duration, EASE, playtimeToVelocity(toPreciseFrame, maxes)]
}
