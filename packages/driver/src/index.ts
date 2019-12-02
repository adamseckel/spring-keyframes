import BezierEasing from 'bezier-easing'

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
type CSSProperty = keyof React.CSSProperties
type CSSFrame = [CSSProperty, number | string]
type TransformFrame = [TransformProperty, number]
type Property = CSSProperty | TransformProperty
export type Frame = { [K in Property]?: number }

const transforms = ['scale', 'x', 'y', 'rotate']
const unitless = ['opacity', 'transform']

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
    lastUncommitedValue = 1,
    lastUncommitedFrame = 0,
    lastUncommitedVelocity = velocity,
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
      lastUncommitedValue = value
      lastUncommitedFrame = frame
      lastUncommitedVelocity = velocity
    } else {
      if (uncommitted) {
        maxes.push([
          lastUncommitedValue,
          lastUncommitedFrame,
          lastUncommitedVelocity,
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
  ouputMax: number = 0,
  outputMin: number = 0
) => (value: number) => {
  return (
    Math.round(
      (((value - inputMin) / (inputMax - inputMin)) * (ouputMax - outputMin) +
        outputMin) *
        100
    ) / 100
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

function toSprungValue(
  value: number,
  from: Frame,
  to: Frame
): [Property, number][] {
  let style: [Property, number][] = []
  const keys = Object.keys(from) as Property[]

  keys.forEach(key => {
    style.push([key, interpolate(1, 0, from[key], to[key])(value)] as [
      Property,
      number
    ])
  })

  return style
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
  if (x || y) {
    block.push(`translate3d(${x || 0}px, ${y || 0}px, 0)`)
  }
  if (rotate) {
    block.push(`rotate3d(1, 0, 0, ${rotate}deg)`)
  }
  if (scale) {
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
    .join('\n  ')
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
  counts.reduce((prev, curr) => {
    return Math.abs(curr[1] - goal) < Math.abs(prev[1] - goal) ? curr : prev
  })

const playTimeToFrameAndVelocity = (
  toFrame: (val: number) => number,
  maxes: Maxes,
  from: Frame,
  to: Frame
) => (playTime: number): [Frame, number] => {
  let value = 0,
    velocity = 0
  const index = playTime / msPerFrame

  // Why do we need to do this?
  const frame = toFrame(index)

  // Get the closest known Max for the frame
  const max = closestFrameIndexForFrame(maxes, frame)
  const i = maxes.indexOf(max)
  const [closestVal, closestF, closestVel] = maxes[i]

  const nextFrame = frame > closestF && maxes[i + 1]
  const lastFrame = frame < closestF && maxes[i - 1]

  // Ensure that the interpolation is performed in the correct direction.
  if (nextFrame) {
    value = interpolate(nextFrame[1], closestF, nextFrame[0], closestVal)(frame)
    velocity = interpolate(nextFrame[1], closestF, nextFrame[2], closestVel)(
      frame
    )
  } else if (lastFrame) {
    value = interpolate(closestF, lastFrame[1], closestVal, lastFrame[0])(frame)
    velocity = interpolate(closestF, lastFrame[1], closestVel, lastFrame[2])(
      frame
    )
  }

  // Convert the linear value to a value on the curve.
  value = ease(value)
  velocity = ease(velocity)

  let f: Frame = {}
  toSprungValue(value, from, to).forEach(([k, v]) => {
    f[k] = v
  })
  return [f, velocity]
}

export default function main(
  from: Frame,
  to: Frame,
  options?: Options
): [string, string, string, (frame: number) => [Frame, number]] {
  const optionsWithDefaults = {
    ...defaults,
    ...options,
  }
  const [maxes, lastFrame] = spring(optionsWithDefaults)

  // Interpolate between keyframe values of 0 - 100 and frame indexes of 0 - x where x is the lastFrame.
  const toFrame = interpolate(0, lastFrame, 0, 100)

  // Generate keyframe, styled value tuples.
  const keyframes = convertMaxesToKeyframes(maxes, toFrame, from, to)

  // Convert to keyframe syntax.
  const cssKeyframes = convertKeyframesToCSS(keyframes)

  // Calculate duration based on the number of frames.
  const duration = Math.round(msPerFrame * lastFrame * 100) / 100 + 'ms'

  // Create a function to return a frame for a play time.
  // Enables interupting animations by creating new ones that start from the current velocity and frame.
  const convertTimeToFrame = playTimeToFrameAndVelocity(
    toFrame,
    maxes,
    from,
    to
  )

  return [cssKeyframes, duration, EASE, convertTimeToFrame]
}
