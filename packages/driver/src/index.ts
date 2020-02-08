import { spring } from './utils/spring'
import { interpolate } from './utils/interpolate'
import { playtimeToVelocity } from './utils/playtimeToVelocity'
import {
  TransformFrame,
  Property,
  Maxes,
  Frame,
  CSSFrame,
  TransformProperty,
  Keyframe,
  Options,
} from './utils/types'
import { msPerFrame } from './utils/msPerFrame'
export const EASE = 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'

export {
  Options,
  Frame,
  Property,
  TransformFrame,
  TransformProperty,
} from './utils/types'

const valueOrDefault = (v: number | undefined, d: number) =>
  v !== undefined ? v : d

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

function toValue(
  value: number,
  from: Frame,
  to: Frame,
  withInvertedScale: boolean
): CSSFrame[] {
  let style: CSSFrame[] = []
  let transform: TransformFrame[] = []
  let keys = Object.keys(from) as Property[]
  const scales = ['scale', 'scaleX', 'scaleY']

  if (withInvertedScale) {
    keys = keys.filter(key => scales.includes(key))
  }

  keys.forEach(key => {
    let v =
      typeof from[key] === 'number'
        ? Math.round(
            interpolate(1, 0, from[key] as number, to[key] as number)(value) *
              100
          ) / 100
        : value === 1
        ? from[key]
        : to[key]

    if (transforms.includes(key)) {
      transform.push([key, v] as TransformFrame)
    } else {
      style.push([key, v] as CSSFrame)
    }
  })

  if (transform.length > 0) {
    style.push([
      'transform',
      createTransformBlock(transform, withInvertedScale),
    ])
  }

  return style
}

const maxScale = 100000
const invertScale = (scale: number) => (scale > 0.001 ? 1 / scale : maxScale)

export function createTransformBlock(
  transforms: TransformFrame[],
  withInvertedScale: boolean
): string {
  const props: Partial<Record<TransformProperty, number>> = {}

  if (withInvertedScale) {
    transforms.forEach(([key, value]) => {
      props[key] = invertScale(value)
    })
  } else {
    transforms.forEach(([key, value]) => {
      props[key] = value
    })
  }

  const {
    x,
    y,
    z,
    scale,
    rotate,
    rotateX,
    rotateY,
    rotateZ,
    scaleX,
    scaleY,
    scaleZ,
  } = props

  const block = []

  // @TODO: Probably better to use a matrix3d here.
  if (x !== undefined || y !== undefined || z !== undefined) {
    block.push(`translate3d(${x || 0}px, ${y || 0}px, ${z || 0}px)`)
  }

  // Stack rotates.
  if (rotate !== undefined || rotateZ !== undefined) {
    block.push(`rotate3d(0, 0, 1, ${rotate || rotateZ}deg)`)
  }
  if (rotateY !== undefined) {
    block.push(`rotate3d(0, 1, 0, ${rotateY}deg)`)
  }
  if (rotateX !== undefined) {
    block.push(`rotate3d(1, 0, 0, ${rotateY}deg)`)
  }

  if (scale !== undefined) {
    block.push(
      `scale3d(${valueOrDefault(scale, 1)}, ${valueOrDefault(scale, 1)}, 1)`
    )
  } else if (
    scaleX !== undefined ||
    scaleY !== undefined ||
    scaleZ !== undefined
  ) {
    block.push(
      `scale3d(${valueOrDefault(scaleX, 1)}, ${valueOrDefault(
        scaleY,
        1
      )}, ${valueOrDefault(scaleZ, 1)})`
    )
  }

  return block.join(' ')
}

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

function breakupFrame(frame: Frame, tweenedProps: Property[]): [Frame, Frame] {
  let tweened: Frame = {}
  let sprung: Frame = {}

  const keys = Object.keys(frame) as Property[]

  keys.forEach(key => {
    if (frame[key] === undefined) return
    if (tweenedProps.includes(key)) {
      // @ts-ignore
      tweened[key] = frame[key]
    } else {
      sprung[key] = frame[key]
    }
  })

  return [tweened, sprung]
}

export function driver(
  from: Frame,
  to: Frame,
  options?: Options
): [string[], string, string, (frame: number) => number] {
  const optionsWithDefaults = {
    ...defaults,
    ...options,
  } as Required<Options>

  const animations: string[] = []

  const [maxes, lastFrame] = spring(optionsWithDefaults)

  // Interpolate between keyframe values of 0 - 100 and frame indexes of 0 - x where x is the lastFrame.
  const toFrame = interpolate(0, lastFrame, 0, 100)

  // Separate Tweened and Sprung properties.
  const [tFrom, sFrom] = breakupFrame(from, optionsWithDefaults.tweenedProps)
  const [tTo, sTo] = breakupFrame(to, optionsWithDefaults.tweenedProps)

  // Generate keyframe, styled value tuples.
  if (Object.keys(sFrom).length || Object.keys(sTo).length) {
    const springKeyframes = convertMaxesToKeyframes(
      maxes,
      toFrame,
      sFrom,
      sTo,
      optionsWithDefaults.withInvertedScale
    )
    animations.push(convertKeyframesToCSS(springKeyframes))
  }

  if (Object.keys(tFrom).length || Object.keys(tTo).length) {
    const tweenedKeyframes = convertMaxesToKeyframes(
      [[1, 0, 0], [0, lastFrame, 0]],
      toFrame,
      tFrom,
      tTo,
      optionsWithDefaults.withInvertedScale
    )
    animations.push(convertKeyframesToCSS(tweenedKeyframes))
  }

  // Calculate duration based on the number of frames.
  const duration = Math.round(msPerFrame * lastFrame * 100) / 100 + 'ms'

  // Create a function to return a frame for a play time.
  // Enables interrupting animations by creating new ones that start from the current velocity and frame.
  return [animations, duration, EASE, playtimeToVelocity(maxes)]
}
