import springer from 'springer'
import { keyframes } from 'emotion'

const defaults = {
  stiffness: 0.5,
  damping: 0.8,
  precision: 2,
  unit: 'px',
}
const numFrames = { length: 101 }
const transformMap = ['x', 'y', 'scale']

function roundToPrecision(num, precision = 2) {
  const decimalPoints = Array.from({ length: precision }).reduce(
    (count = 1) => count * 10
  )
  return Math.ceil(num * decimalPoints) / decimalPoints
}

function calcPropTweenVal(
  prop,
  frame,
  from,
  to,
  { damping, stiffness, precision }
) {
  return roundToPrecision(
    from[prop] +
      (to[prop] - from[prop]) * springer(damping, stiffness)(frame / 100),
    precision
  )
}

function createCalcPropTweenVal(from, to, options) {
  return (prop, frame) => calcPropTweenVal(prop, frame, from, to, options)
}

function splitTransform(prop, v, transformList = []) {
  return transformMap.includes(prop)
    ? { transform: [...transformList, [prop, v]] }
    : { [prop]: v }
}

function reduceFrame(tween, property, value) {
  return { ...tween, ...splitTransform(property, value, tween.transform) }
}

function mapTransformPropToCss(prop, spring, unit = 'px') {
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

function mapTransformProps(spring, unit) {
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
      `${animation} ${mapPropTypes(prop, spring[prop], unit)}`,
    ''
  )
}

export function spring({ from, to }, options) {
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
      return lastIndex > 0 ? frames[lastIndex][1] !== spring : true
    })
    .map(([frame, spring]) => `${frame} { ${spring} }`)
}

export default function({ from, to }, options) {
  return keyframes(spring({ from, to }, options).join(''))
}
