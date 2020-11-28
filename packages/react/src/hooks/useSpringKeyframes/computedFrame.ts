import { Frame, Property } from "@spring-keyframes/driver"
import { fromMatrix, isTransform, identity, Transforms } from "@spring-keyframes/matrix"
import * as React from "react"

function collectTransforms(currentStyle: CSSStyleDeclaration): Transforms | null {
  if (!currentStyle.transform || currentStyle.transform === "none") return null
  return fromMatrix(currentStyle.transform)
}

export function computedFrame(targetFrame?: Frame, ref?: React.RefObject<HTMLElement>): Frame {
  if (!ref?.current && targetFrame) return targetFrame

  if (!ref?.current) return {}

  const currentStyle = getComputedStyle(ref.current)
  const transforms = collectTransforms(currentStyle)

  if (!targetFrame || !transforms) return currentStyle

  return onlyTargetProperties(targetFrame, currentStyle, transforms)
}

function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function onlyTargetProperties(target: Frame, current: Frame, transforms?: Partial<Transforms>) {
  const newFrame: Frame = {}
  const properties = Object.keys(target) as Property[]

  for (const property of properties) {
    if (isTransform(property) && transforms && !isUndefined(transforms[property])) {
      newFrame[property] = transforms[property]
    } else if (isUndefined(current[property])) {
      newFrame[property] = isTransform(property) ? identity[property] : 0
    } else {
      newFrame[property] = current[property]
    }
  }

  return newFrame
}
