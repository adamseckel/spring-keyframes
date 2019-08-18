import springer from 'springer'
import { keyframes } from '@emotion/core'

const defaults = {
  stiffness: 0.5,
  damping: 0.8,
  precision: 2,
  unit: 'px',
}

const numFrames = { length: 101 }
const transformMap = ['x', 'y', 'scale']

function roundToPrecision(num: number, precision = 2) {
  const decimalPoints = Array.from({ length: precision }).reduce(
    (count = 1) => count * 10
  )
  return Math.ceil(num * decimalPoints) / decimalPoints
}

function calcPropTweenVal(
  prop: keyof Css,
  frame: number,
  from: Css,
  to: Css,
  { damping, stiffness, precision }: Options
) {
  const spring = springer(damping, stiffness)
  const value = from[prop] + (to[prop] - from[prop]) * spring(frame / 100)

  return roundToPrecision(value, precision)
}
const createCalcPropTweenVal = (from: Css, to: Css, options: Options) => (
  prop: keyof Css,
  frame: number
) => calcPropTweenVal(prop, frame, from, to, options)

function splitTransform(prop: keyof Css, v, transformList = []) {
  return transformMap.includes(prop)
    ? { transform: [...transformList, [prop, v]] }
    : { [prop]: v }
}

function reduceFrame(
  tween: Record<string, any>,
  property: keyof Css,
  value: number
) {
  return { ...tween, ...splitTransform(property, value, tween.transform) }
}

function mapTransformPropToCss(prop: keyof Css, spring, unit = 'px') {
  switch (prop) {
    case 'y':
      return `translateY(${spring}${unit})`
    case 'x':
      return `translateX(${spring}${unit})`
    case 'scale':
      return `scale3d(${spring}, ${spring}, 1)`
    default:
      return `${prop}(${spring})`
  }
}

function mapTransformProps(spring, unit: string) {
  return spring.reduce(
    (transform, [prop, spring]) =>
      `${transform} ${mapTransformPropToCss(prop, spring, unit)}`,
    'transform:'
  )
}

function mapPropTypes(prop, spring, unit) {
  return prop === 'transform'
    ? `${mapTransformProps(spring, unit)};`
    : `${prop}: ${spring};`
}

function mapToCss(spring, unit) {
  return Object.keys(spring).reduce(
    (animation, prop) =>
      `${animation}${mapPropTypes(prop, spring[prop], unit)}`,
    ''
  )
}

export function spring({ from, to }: Props, options: Options) {
  const { stiffness, damping, precision, unit } = {
    ...defaults,
    ...options,
  }

  const calcTween = createCalcPropTweenVal(from, to, {
    stiffness,
    damping,
    precision,
  })

  return Array.from(numFrames)
    .map((_, frame) => [
      Object.keys(from).reduce(
        (tween, prop) => reduceFrame(tween, prop, calcTween(prop, frame)),
        {}
      ),
      frame,
    ])

    .map(([spring, frame]) => [`${frame}%`, mapToCss(spring, unit)])
    .filter(([frame, spring], i, frames) => {
      const lastIndex = i - 1 > 0 ? i - 1 : 0
      return lastIndex > 0 && frame !== '100%'
        ? frames[lastIndex][1] !== spring
        : true
    })
    .map(([frame, spring]) => `${frame} {${spring}}`)
}

export interface Props {
  from: Css
  to: Css
}

interface Css {
  x?: number
  y?: number
  scale?: number
  opacity?: number
}

interface Options {
  stiffness?: number
  damping?: number
  precision?: number
  unit?: string
}

export default function({ from, to }: Props, options: Options) {
  return keyframes(spring({ from, to }, options).join(''))
}
