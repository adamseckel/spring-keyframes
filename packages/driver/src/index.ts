import BezierEasing from 'bezier-easing'
import * as CSS from 'csstype'
// ---------- @CHENGLOU's STEPPER ----------
// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
// array reference around.
let reusedTuple: [number, number] = [0, 0]
function stepper(
  secondPerFrame: number,
  x: number,
  v: number,
  destX: number,
  k: number,
  b: number,
  mass: number,
  precision: number
): [number, number] {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  const Fspring = -k * (x - destX)

  // Damping, in kg / s
  const Fdamper = -b * v

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  let a = (Fspring + Fdamper) / mass
  // const a = Fspring + Fdamper

  const newV = v + a * secondPerFrame
  const newX = x + newV * secondPerFrame

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX
    reusedTuple[1] = 0
    return reusedTuple
  }

  reusedTuple[0] = newX
  reusedTuple[1] = newV
  return reusedTuple
}

// ---------- @spring-keyframes/driver ----------
const msPerFrame = 1000 / 60
const EASE = 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
const ease = BezierEasing(0.445, 0.05, 0.55, 0.95)

type Max = [number, number, number]
type Maxes = Max[]
type TransformProperty = 'scale' | 'x' | 'y' | 'rotate'
type CSSProperty = keyof CSS.Properties
type CSSFrame = [CSSProperty, number | string]
type TransformFrame = [TransformProperty, number]
export type Property = CSSProperty | TransformProperty
export type Frame = { [K in Property]?: number }

const transforms = ['scale', 'x', 'y', 'rotate']
const unitless = ['opacity', 'transform', 'color', 'background']
const tweenedProperties: Property[] = ['color', 'backgroundColor', 'background']

function spring({
  stiffness,
  damping,
  precision,
  mass,
  velocity,
}: Required<Options>): [Maxes, number] {
  let lastValue = 1,
    lastVelocity = velocity,
    uncommitted = false,
    lastUncommittedValue = 1,
    lastUncommittedFrame = 0,
    lastUncommittedVelocity = velocity,
    frame = 0,
    lastFrame: number = 0,
    maxes: Maxes = [[1, 0, velocity]]

  while (lastFrame === 0) {
    let [value, velocity] = stepper(
      msPerFrame / 1000,
      lastValue,
      lastVelocity,
      0,
      stiffness,
      damping,
      mass,
      precision
    )

    frame += 1

    if (velocity === 0) {
      maxes.push([0, frame, 0])
      lastFrame = frame
      break
    }

    if (Math.abs(value) > Math.abs(lastValue)) {
      uncommitted = true
      lastUncommittedValue = value
      lastUncommittedFrame = frame
      lastUncommittedVelocity = velocity
    } else {
      if (uncommitted) {
        maxes.push([
          lastUncommittedValue,
          lastUncommittedFrame,
          lastUncommittedVelocity,
        ])
      }
      uncommitted = false
    }

    lastValue = value
    lastVelocity = velocity
  }

  return [maxes, lastFrame]
}

type FrameNumber = number

type Keyframe = [
  /** Frame */
  FrameNumber,
  /** value */
  CSSFrame[]
]

const interpolate = (
  inputMax: number = 0,
  inputMin: number = 0,
  outputMax: number = 0,
  outputMin: number = 0,
  withEase?: (v: number) => number,
  roundTo: number = 100
) => (value: number) => {
  const fn = withEase ? withEase : (v: number) => v

  return (
    Math.round(
      fn(
        ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
          outputMin
      ) * roundTo
    ) / roundTo
  )
}

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
        interpolate(1, 0, from[key], to[key])(value),
      ] as TransformFrame)
    } else {
      style.push([
        key,
        interpolate(1, 0, from[key], to[key])(value),
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

  const { x, y, scale, rotate } = props

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

  return block.join(' ')
}

function createBlock(value: CSSFrame[]) {
  return value
    .map(([prop, val]) => `${prop}: ${val}${unitForProp(prop)}`)
    .join('; ')
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

const closestFrameIndexForFrame = (counts: Maxes, goal: number) =>
  counts.reduce((prev, curr) =>
    Math.abs(curr[1] - goal) < Math.abs(prev[1] - goal) ? curr : prev
  )

const highLowFrame = (maxes: Maxes, frame: number, i: number) => {
  if (frame > maxes[i][1]) {
    return [maxes[i], maxes[i + 1]]
  }
  return [maxes[i - 1], maxes[i]]
}

const playTimeToApproxVelocity = (
  toFrame: (val: number) => number,
  maxes: Maxes
) => (playTime: number): number => {
  const index = playTime / msPerFrame
  const frame = toFrame(index)

  // Get the closest known Max for the frame
  const max = closestFrameIndexForFrame(maxes, frame)
  const i = maxes.indexOf(max)
  if (maxes.length === i + 1) return 0
  const [high, low] = highLowFrame(maxes, frame, i)
  if (!low) return high[2]

  try {
    return interpolate(high[1], low[1], high[2], low[2], ease)(frame)
  } catch (error) {
    return 0
  }
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
  const convertTimeToApproxVelocity = playTimeToApproxVelocity(
    toPreciseFrame,
    maxes
  )

  return [animations, duration, EASE, convertTimeToApproxVelocity]
}
