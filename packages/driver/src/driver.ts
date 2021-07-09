import type { SpringOptions } from "popmotion"

import { interpolate } from "./utils/interpolate"
import { Spring } from "./utils/Spring"
import { isNumber, isUndefined } from "./utils/typechecks"
import * as Properties from "./utils/properties"
import { createTransformString } from "./utils/createTransformString"
import { invertScale } from "./utils/invertScale"
import { msPerFrame } from "./utils/msPerFrame"
import { createKeyframeString } from "./utils/createKeyframeString"

export interface InvertedAnimation {
  from: Record<string, any>
  to: Record<string, any>
}

export interface Options extends Omit<SpringOptions, "from" | "to"> {
  tweened?: string[]
  withInversion?: boolean
  invertedAnimation?: InvertedAnimation
}

export const EASE = "cubic-bezier(0.445, 0.050, 0.550, 0.950)"

const inverted: InvertedAnimation = {
  from: { scale: 1 },
  to: { scale: 1 },
}

function withDefaults(options?: Options) {
  const withInversion = options?.withInversion || !!options?.invertedAnimation || false
  const invertedAnimation = options?.invertedAnimation || inverted

  return {
    stiffness: 180,
    damping: 12,
    mass: 1,
    restDelta: 0.001,
    ...options,
    velocity: options?.velocity || 0,
    withInversion,
    invertedAnimation,
  }
}

interface Result {
  readonly ease: "cubic-bezier(0.445, 0.050, 0.550, 0.950)"
  readonly resolveVelocity: (time: number) => number
  readonly duration: number
  readonly keyframes: Record<string, any>[] | string
  readonly inversions: Record<string, any>[] | string
}

export interface Frame extends Record<string, number | string | undefined> {}
export interface Keyframe extends Frame {
  offset: number
}

interface WAAPIResult extends Result {
  keyframes: Keyframe[]
  inversions: Keyframe[]
}

interface KeyframesResult extends Result {
  keyframes: string
  inversions: string
}

function driver(from: Frame, to: Frame, options?: Options, target?: "array"): WAAPIResult
function driver(from: Frame, to: Frame, options?: Options, target?: "string"): KeyframesResult
function driver(from: Frame, to: Frame, options?: Options, target?: "array" | "string"): Result {
  const { withInversion, invertedAnimation, ...optionsWithDefaults } = withDefaults(options)
  const spring = new Spring(0, 1, 2, 0.001, optionsWithDefaults)

  let lastFrame = 0
  const keyframes: Keyframe[] = []
  const inversions: Keyframe[] = []

  const properties = Object.keys(from)
  const invertedProperties = Object.keys(invertedAnimation.from)

  spring.forEach((value, index, done) => {
    const keyframe: Keyframe = {
      offset: index,
    }

    let hasTransforms = false
    const transforms: Frame = {}
    for (const prop of properties) {
      const f = from[prop]
      const t = to[prop]

      if (isUndefined(f) || isUndefined(t)) continue

      const propValue =
        isNumber(f) && isNumber(t) ? Math.round(interpolate(0, 1, f, t)(value) * 10000) / 10000 : value === 0 ? f : t

      if (isUndefined(propValue)) continue

      if (Properties.transforms.includes(prop)) {
        hasTransforms = true
        transforms[prop] = propValue
      } else {
        keyframe[prop] = propValue
      }
    }

    if (hasTransforms) keyframe.transform = createTransformString(transforms)

    keyframes.push(keyframe)

    if (hasTransforms && withInversion) {
      const inversionTransforms: Record<string, number> = {}

      for (const prop of invertedProperties) {
        const toInvert = transforms[prop] as number
        const inversionValue =
          Math.round(interpolate(0, 1, invertedAnimation.from[prop], invertedAnimation.to[prop])(toInvert) * 10000) /
          10000
        inversionTransforms[prop] = invertScale(toInvert, inversionValue)
      }

      inversions.push({
        offset: index,
        transform: createTransformString(inversionTransforms),
      })
    }

    if (done) lastFrame = index
  }, withInversion)

  const keyframe = interpolate(0, lastFrame, 0, 1)

  let keyframesString: string[] = []
  let inversionsString: string[] = []

  if (target === "array") {
    for (let index = 0; index < keyframes.length; index++) {
      keyframes[index].offset = keyframe(keyframes[index].offset)
      if (withInversion) inversions[index].offset = keyframe(inversions[index].offset)
    }
  } else if (target === "string") {
    for (let index = 0; index < keyframes.length; index++) {
      keyframesString.push(createKeyframeString(keyframes[index].offset, keyframes[index], keyframe))

      if (withInversion)
        inversionsString.push(createKeyframeString(inversions[index].offset, inversions[index], keyframe))
    }
  }

  return {
    ease: EASE,
    resolveVelocity: spring.resolveVelocity!,
    duration: Math.round(msPerFrame * lastFrame * 10000) / 10000,
    keyframes: target === "array" ? keyframes : keyframesString.join("\n"),
    inversions: target === "array" ? inversions : inversionsString.join("\n"),
  }
}

export function keyframesDriver(
  from: Record<string, any>,
  to: Record<string, any>,
  options?: Options
): KeyframesResult {
  return driver(from, to, options, "string")
}

export function waapiDriver(from: Record<string, any>, to: Record<string, any>, options?: Options): WAAPIResult {
  return driver(from, to, options, "array")
}
