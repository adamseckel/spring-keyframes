import { Frame, Property } from "@spring-keyframes/driver"
import { fromMatrix, isTransform, identity, Transforms } from "@spring-keyframes/matrix"
import computedStyle from "./computedStyle"
import * as React from "react"
import { Interaction } from "../../utils/types"

function collectTransforms(currentStyle: CSSStyleDeclaration): Transforms | null {
  if (!currentStyle.transform || currentStyle.transform === "none") return null
  return fromMatrix(currentStyle.transform)
}

export function createComputedFrame(targetFrame?: Frame, ref?: React.RefObject<HTMLElement>): Frame {
  if (!ref?.current && targetFrame) return targetFrame

  if (!ref?.current) return {}

  const currentStyle = computedStyle(ref.current)
  const transforms = collectTransforms(currentStyle)

  if (!targetFrame) return { ...currentStyle, ...transforms, transform: undefined } as Frame

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

export type Stack = Map<Interaction, Frame>
export function createResolvedBase(nextInteraction: Interaction, stack: Stack): Frame {
  const resolvedBase = {}

  for (let interaction = Interaction.Mount; interaction <= nextInteraction; interaction++) {
    if (stack.has(interaction)) Object.assign(resolvedBase, stack.get(interaction))
  }

  return resolvedBase
}

export function getNextStackInteraction(
  candidate: Interaction,
  stack: Stack,
  lastInteraction: Interaction | undefined
): Interaction {
  if (candidate === Interaction.None) {
    if (!lastInteraction) return Interaction.Identity

    for (let index = lastInteraction - 1; index > Interaction.None; index--) {
      const stackItem = stack?.has(index)
      if (stackItem) return index
    }

    return Interaction.Identity
  } else if (lastInteraction && candidate < lastInteraction) {
    return lastInteraction
  }

  return candidate
}

interface Options {
  identity?: Frame
  base?: Frame
  lastFrame?: Frame
}

export function createResolvedFrame(
  ref: React.RefObject<HTMLElement>,
  from: Frame | undefined,
  to: Frame | undefined,
  { identity, base, lastFrame }: Options = {},
  velocity: number = 0,
  isAnimating: boolean = false
) {
  // If a specific From and To Frame are provided, use them both. We assume
  // they match.
  if (from && to) {
    return { from: { ...base, ...from }, to: { ...base, ...to }, velocity }
  }

  if (identity) {
    // If From is provided but To is not, we assume the target animation is to
    // the base style.
    if (from && !to) {
      const mergedFrom = { ...base, ...from }
      console.log("a")
      return {
        from: mergedFrom,
        to: onlyTargetProperties(mergedFrom, { ...identity, ...base }),
        velocity,
      }
    }
    // If To is provided but From is not, we assume we are animating from
    // current styles, to To.
    if (!from && to) {
      /**@TODO is there a scenario where we need to merge computed style and resolved values */
      const mergedTo = { ...base, ...to }
      if (isAnimating) {
        console.log("b")

        return { from: createComputedFrame(mergedTo, ref), to: mergedTo, velocity }
      } else if (base) {
        console.log("c")

        return {
          from: onlyTargetProperties(mergedTo, { ...identity, ...base }),
          to: mergedTo,
          velocity,
        }
      } else {
        console.log("d")

        return { from: onlyTargetProperties(mergedTo, identity), to: mergedTo, velocity }
      }
    }

    // Finally, if neither From or To are provided, and we have previously
    // animated to a specific Frame, we animate from that Frame to the base
    // style.
    if (!from && !to && lastFrame && base) {
      if (isAnimating) {
        console.log("e")

        return {
          from: createComputedFrame(lastFrame, ref),
          to: onlyTargetProperties(lastFrame, { ...identity, ...base }),
          velocity,
        }
      }
      console.log("f")

      return { from: lastFrame, to: onlyTargetProperties(lastFrame, { ...identity, ...base }), velocity }
    }
  }
  console.log("NOTHING")
  return { from: {}, to: {}, velocity }
}
