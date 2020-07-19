import { spring } from './utils/spring'
import { interpolate } from './utils/interpolate'
import { playtimeToVelocity } from './utils/playtimeToVelocity'
import {
  TransformFrame,
  Property,
  Maxes,
  Frame,
  CSSFrame,
  Keyframe,
  Options,
} from './utils/types'
import { msPerFrame } from './utils/msPerFrame'
import {
  Transforms,
  createTransformString,
} from './utils/createTransformString'
export const EASE = 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'

export {
  Options,
  Frame,
  Property,
  TransformFrame,
  TransformProperty,
} from './utils/types'

export { spring as springEveryFrame, Transforms, createTransformString }

export const transforms = [
  'x',
  'y',
  'z',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
]

const unitless = [
  'transform',
  'opacity',
  'color',
  'background',
  'backgroundColor',
]

export const tweenedProperties: Property[] = [
  'color',
  'backgroundColor',
  'background',
  'opacity',
]

function convertMaxesToKeyframes(
  maxes: Maxes,
  toFrame: (value: number) => number,
  from: Frame,
  to: Frame,
  withInvertedScale: boolean
): Keyframe[] {
  return maxes.map(([value, index]) => [
    Math.round(toFrame(index) * 100) / 100,
    toValue(value, from, to, withInvertedScale),
  ])
}

const scales = ['scale', 'scaleX', 'scaleY']
function toValue(
  value: number,
  from: Frame,
  to: Frame,
  withInvertedScale: boolean
): CSSFrame[] {
  let style: CSSFrame[] = []
  let transform: TransformFrame[] = []
  let keys = Object.keys(from) as Property[]

  if (withInvertedScale) {
    keys = keys.filter(key => scales.includes(key))
  }

  keys.forEach(key => {
    let v =
      typeof from[key] === 'number'
        ? Math.round(
            interpolate(0, 1, from[key] as number, to[key] as number)(value) *
              100
          ) / 100
        : value === 0
        ? from[key]
        : to[key]

    if (transforms.includes(key)) {
      transform.push([key, v] as TransformFrame)
    } else {
      style.push([key, v] as CSSFrame)
    }
  })

  if (transform.length > 0) {
    const props: Transforms = {}

    if (withInvertedScale) {
      transform.forEach(([key, value]) => {
        const v = to[key]
        const offset = (v !== undefined ? v - 1 : 0) + 1
        props[key] = invertScale(value) * offset
      })
    } else {
      transform.forEach(([key, value]) => {
        props[key] = value
      })
    }

    style.push(['transform', createTransformString(props)])
  }

  return style
}

const maxScale = 100000
const invertScale = (scale: number) => (scale > 0.001 ? 1 / scale : maxScale)

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

const defaults: Options = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  precision: 0.01,
  velocity: 0,
  tweenedProps: tweenedProperties,
  withInvertedScale: false,
}

// function createTweenedKeyframes(from: CSSFrame[], to: CSSFrame[]): Keyframe[] {
//   return [[0, from], [100, to]]
// }

interface SplitFrame {
  from: Frame
  to: Frame
}

function breakupFrame(from: Frame, to: Frame, tweenedProps: string[]) {
  const tweened: SplitFrame = { from: {}, to: {} }
  const sprung: SplitFrame = { from: {}, to: {} }

  for (const key in from) {
    if (from[key as keyof Frame] === undefined) continue
    if (tweenedProps.includes(key)) {
      //@ts-ignore
      tweened.from[key] = from[key]
      //@ts-ignore
      tweened.to[key] = to[key]
    } else {
      //@ts-ignore
      sprung.from[key] = from[key]
      //@ts-ignore
      sprung.to[key] = to[key]
    }
  }

  return [tweened, sprung] as const
}

function createKeyframes(
  from: Frame,
  to: Frame,
  maxes: Maxes,
  interpolate: (value: number) => number,
  invert: boolean = false
) {
  if (!Object.keys(from).length && !Object.keys(to).length) return

  return convertKeyframesToCSS(
    convertMaxesToKeyframes(maxes, interpolate, from, to, invert)
  )
}
const tween = (last: number): [number, number, number, boolean][] => [
  [0, 0, 0, true],
  [1, last, 0, true],
]

interface DriverOutput {
  sprung?: string
  tweened?: string
  inverted?: string
  duration: string
  ease: string
  playTimeToVelocity: (time: number) => number
}

export function driver(
  from: Frame,
  to: Frame,
  options?: Options
): DriverOutput {
  const optionsWithDefaults = {
    ...defaults,
    ...options,
  } as Required<Options>

  const [maxes, lastFrame] = spring(optionsWithDefaults)

  // Interpolate between keyframe values of 0 - 100 and frame indexes of 0 - x where x is the lastFrame.
  const toFrame = interpolate(0, lastFrame, 0, 100)

  // Separate Tweened and Sprung properties.
  const [t, s] = breakupFrame(from, to, optionsWithDefaults.tweenedProps)

  const sprung = createKeyframes(s.from, s.to, maxes, toFrame)
  const tweened = createKeyframes(t.from, t.to, tween(lastFrame), toFrame)
  const inverted = optionsWithDefaults.withInvertedScale
    ? createKeyframes(s.from, s.to, maxes, toFrame, true)
    : undefined

  // Calculate duration based on the number of frames.
  const duration = Math.round(msPerFrame * lastFrame * 100) / 100 + 'ms'

  // Create a function to return a frame for a play time.
  // Enables interrupting animations by creating new ones that start from the current velocity and frame.

  return {
    sprung,
    tweened,
    inverted,
    duration,
    ease: EASE,
    playTimeToVelocity: playtimeToVelocity(maxes),
  }
}
