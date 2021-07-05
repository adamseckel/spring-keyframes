import type { Frame, InvertedAnimation, KeyframeItem, Property, ScaleFrame, TransformFrame, Keyframe } from "./types"
import { interpolate } from "./interpolate"
import { isNumber, isUndefined } from "./typechecks"
import * as Properties from "./properties"
import { createTransformString, Transforms } from "./createTransformString"
import { invertScale } from "./invertScale"

const inversions = ["scale", "scaleX", "scaleY", "x", "y"]

function isTransformFrame(property: Property, _frame: KeyframeItem): _frame is TransformFrame {
  return Properties.transforms.includes(property)
}

function isInverted(_transforms: TransformFrame[], invertedAnimation?: InvertedAnimation): _transforms is ScaleFrame[] {
  return !!invertedAnimation
}

function camelCaseToDash(property: string) {
  return property.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase()
}

function unitForProp(prop: Property) {
  return Properties.unitless.includes(prop) ? "" : "px"
}

const createCSSDeclaration = (property: Property, value: string | number) =>
  `${camelCaseToDash(property)}: ${value}${unitForProp(property)}`

export const makeCreateKeyframe = (
  from: Frame,
  to: Frame,
  tweened: Property[],
  invertedAnimation: InvertedAnimation
) => (value: number, index: number, withInversion: boolean) =>
  createKeyframe(from, to, value, index, tweened, false, withInversion, invertedAnimation)

export function createKeyframe(
  from: Frame,
  to: Frame,
  value: number,
  index: number,
  tweened: Property[] = [],
  asTweened?: boolean,
  withInversion?: boolean,
  invertedAnimation?: InvertedAnimation
): Keyframe | undefined {
  const style: string[] = []
  const transforms: TransformFrame[] = []

  let properties = Object.keys(from) as Property[]
  if (withInversion) properties = properties.filter((key) => inversions.includes(key))

  for (const property of properties) {
    if (tweened.includes(property) ? !asTweened : asTweened) continue

    const propertyValue = isNumber(from[property])
      ? Math.round(interpolate(0, 1, from[property] as number, to[property] as number)(value) * 10000) / 10000
      : value === 0
      ? from[property]
      : to[property]

    if (isUndefined(propertyValue)) continue

    const frame: KeyframeItem = [property, propertyValue]
    isTransformFrame(property, frame)
      ? transforms.push(frame)
      : style.push(createCSSDeclaration(property, propertyValue))
  }

  if (transforms.length > 0) {
    const transformString =
      withInversion && !!invertedAnimation && isInverted(transforms, invertedAnimation)
        ? processInvertedScaleTransforms(transforms, value, invertedAnimation)
        : processTransforms(transforms)

    style.push(createCSSDeclaration("transform", transformString))
  }

  if (style.length) return [index, style.join("; ")]
  return undefined
}

function processInvertedScaleTransforms(
  transforms: ScaleFrame[],
  value: number,
  invertedAnimation: InvertedAnimation
): string {
  const props: Transforms = {}

  for (const [property, v] of transforms) {
    if (property === "x" || property === "y") {
      props[property] = value
      continue
    }
    const { from, to } = invertedAnimation
    const invertedValue = Math.round(interpolate(0, 1, from[property], to[property])(value) * 10000) / 10000
    props[property] = invertScale(v, invertedValue)
  }

  return createTransformString(props)
}

function processTransforms(transforms: TransformFrame[]): string {
  const props: Transforms = {}

  for (const [property, value] of transforms) props[property] = value

  return createTransformString(props)
}
