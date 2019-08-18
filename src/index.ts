import springer from 'springer'
import { keyframes } from '@emotion/core'

const defaults = {
  stiffness: 50,
  damping: 80,
  precision: 2,
  unit: 'px',
}

const transformMap = ['x', 'y', 'scale']

function roundToPrecision(num: number, precision = 2) {
  const decimalPoints = Math.pow(10, precision)

  return Math.ceil(num * decimalPoints) / decimalPoints
}

const calcPropTweenVal = (
  prop: keyof Css,
  frame: number,
  from: Partial<Css>,
  to: Partial<Css>,
  { precision }: Pick<Options, 'precision'>
) => (spring: (number: any) => number) => {
  const value =
    (from[prop] || 0) +
    ((to[prop] || 0) - (from[prop] || 0)) * spring(frame / 100)

  return roundToPrecision(value, precision)
}

const createCalcPropTweenVal = (
  from: Partial<Css>,
  to: Partial<Css>,
  options: Omit<Options, 'unit'>
) => (prop: keyof Css, frame: number) => {
  const spring = springer(options.damping / 100, options.stiffness / 100)
  return calcPropTweenVal(prop, frame, from, to, options)(spring)
}

const splitTransform = (prop: keyof Css, value: number, transformList = []) =>
  transformMap.includes(prop)
    ? { transform: [...transformList, [prop, value]] }
    : { [prop]: value }

const reduceFrame = (
  tween: Record<string, any>,
  property: keyof Css,
  value: number
) => ({ ...tween, ...splitTransform(property, value, tween.transform) })

function mapTransformPropToCss(
  prop: keyof Css,
  sprungValue: number,
  unit = 'px'
) {
  switch (prop) {
    case 'y':
      return `translateY(${sprungValue}${unit})`
    case 'x':
      return `translateX(${sprungValue}${unit})`
    case 'scale':
      return `scale3d(${sprungValue}, ${sprungValue}, 1)`
    default:
      return `${prop}(${sprungValue})`
  }
}

const mapTransformProps = (
  sprungFrameTuples: [keyof Css, number][],
  unit: string
) =>
  sprungFrameTuples.reduce(
    (transform, [prop, spring]) =>
      `${transform} ${mapTransformPropToCss(prop, spring, unit)}`,
    'transform:'
  )

const mapPropTypes = (
  prop: string,
  spring: [keyof Css, number][],
  unit: string
) =>
  prop === 'transform'
    ? `${mapTransformProps(spring, unit)};`
    : `${prop}: ${spring};`

const mapToCss = (spring: any, unit: string) =>
  Object.keys(spring).reduce(
    (animation, prop) =>
      `${animation}${mapPropTypes(prop, spring[prop], unit)}`,
    ''
  )

export function spring({ from, to }: Props, options?: Partial<Options>) {
  const { stiffness, damping, precision, unit } = {
    ...defaults,
    ...options,
  }

  const calcTween = createCalcPropTweenVal(from, to, {
    stiffness,
    damping,
    precision,
  })

  const frames = new Array(101).fill('')

  return frames
    .map((_, frame: number) => [
      Object.keys(from).reduce(
        //@ts-ignore
        (tween, prop: keyof Css) =>
          reduceFrame(tween, prop, calcTween(prop, frame)),
        {}
      ),
      frame,
    ])
    .map(([sprungValues, frame]) => [`${frame}%`, mapToCss(sprungValues, unit)])
    .filter(([frame, spring], i, frames) => {
      const lastIndex = i - 1 > 0 ? i - 1 : 0
      return lastIndex > 0 && frame !== '100%'
        ? frames[lastIndex][1] !== spring
        : true
    })
    .map(([frame, spring]) => `${frame} {${spring}}`)
}

export interface Props {
  from: Partial<Css>
  to: Partial<Css>
}

interface Css {
  x: number
  y: number
  scale: number
  opacity: number
}

interface Options {
  stiffness: number
  damping: number
  precision: number
  unit: string
}

export default function({ from, to }: Props, options?: Partial<Options>) {
  return keyframes(spring({ from, to }, options).join(''))
}
