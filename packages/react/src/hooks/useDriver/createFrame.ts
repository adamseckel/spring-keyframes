import { Frame, Property } from "@spring-keyframes/driver"
import { fromMatrix, isTransform, identity, Transforms } from "@spring-keyframes/matrix"
import computedStyle from "./computedStyle"
import * as React from "react"

function collectTransforms(currentStyle: CSSStyleDeclaration): Transforms | null {
  if (!currentStyle.transform || currentStyle.transform === "none") return null
  return fromMatrix(currentStyle.transform)
}

export function createComputedFrame(targetFrame?: Frame, ref?: React.RefObject<HTMLElement>): Frame {
  if (!ref?.current && targetFrame) return targetFrame

  if (!ref?.current) return {}

  const currentStyle = computedStyle(ref.current)
  const transforms = collectTransforms(currentStyle)

  if (!targetFrame) return Object.assign(currentStyle, transforms, { transform: undefined }) as Frame

  return onlyTargetProperties(targetFrame, currentStyle as Frame, transforms)
}

function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

function onlyTargetProperties(target: Frame, current: Frame, transforms?: Partial<Transforms> | null) {
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

export function createResolvedFrame(
  ref: React.RefObject<HTMLElement>,
  from: Frame | undefined,
  to: Frame | undefined,
  baseFrame?: Frame,
  lastResolvedFrame?: Frame,
  velocity: number = 0,
  isAnimating: boolean = false
) {
  // If a specific From and To Frame are provided, use them both. We assume
  // they match.
  if (from && to) {
    return { from: { ...lastResolvedFrame, ...from }, to: { ...lastResolvedFrame, ...to }, velocity }
  }

  if (baseFrame) {
    // If From is provided but To is not, we assume the target animation is to
    // the base style.
    if (from && !to) {
      const mergedFrom = { ...lastResolvedFrame, ...from }
      return {
        from: mergedFrom,
        to: onlyTargetProperties(mergedFrom, { ...baseFrame, ...lastResolvedFrame }),
        velocity,
      }
    }
    // If To is provided but From is not, we assume we are animating from
    // current styles, to To.
    if (!from && to) {
      /**@TODO is there a scenario where we need to merge computed style and resolved values */
      const mergedTo = { ...lastResolvedFrame, ...to }
      if (isAnimating) {
        return { from: createComputedFrame(mergedTo, ref), to: mergedTo, velocity }
      } else if (lastResolvedFrame) {
        return {
          from: onlyTargetProperties(mergedTo, { ...baseFrame, ...lastResolvedFrame }),
          to: mergedTo,
          velocity,
        }
      } else {
        return { from: onlyTargetProperties(mergedTo, baseFrame), to: mergedTo, velocity }
      }
    }

    // Finally, if neither From or To are provided, and we have previously
    // animated to a specific Frame, we animate from that Frame to the base
    // style.
    if (!from && !to && lastResolvedFrame) {
      if (isAnimating) {
        return {
          from: createComputedFrame(lastResolvedFrame, ref),
          to: lastResolvedFrame,
          velocity,
        }
      }

      return { from: lastResolvedFrame, to: lastResolvedFrame, velocity }
    }
  }

  return { from: {}, to: {}, velocity }
}
