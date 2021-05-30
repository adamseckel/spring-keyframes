import type { Frame } from "@spring-keyframes/driver"
import type * as React from "react"

import { onlyTargetProperties } from "./onlyTargetProperties"
import { createComputedFrame } from "./createComputedFrame"

interface Options {
  identity?: Frame
  base?: Frame
  lastFrame?: Frame
}

export function resolveFrame(
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
