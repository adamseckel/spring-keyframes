import type { Frame, Options, Keyframe } from "./utils/types"
import { interpolate } from "./utils/interpolate"
import { msPerFrame } from "./utils/msPerFrame"
import { createSpring } from "./utils/popmotion/createSpring"
import { makeCreateKeyframe } from "./utils/createKeyframe"
import { createSprungKeyframes, createTweenedKeyframes } from "./utils/createKeyframeString"
import { resolveCurrentValues } from "./utils/resolveCurrentValues"
import * as Properties from "./utils/properties"

export const EASE = "cubic-bezier(0.445, 0.050, 0.550, 0.950)"

const identity = {
  scale: 1,
  scaleX: 1,
  scaleY: 1,
}

const inverted = {
  from: identity,
  to: identity,
}

function withDefaults(options?: Options): Required<Options> {
  const withInversion = options?.withInversion || !!options?.invertedAnimation || false
  const invertedAnimation = options?.invertedAnimation || inverted

  return {
    stiffness: 180,
    damping: 12,
    mass: 1,
    ...options,
    velocity: options?.velocity || 0,
    tweened: options?.tweened || Properties.tweened,
    withInversion,
    invertedAnimation,
  }
}

function pushValidKeyframes(value: any, keyframes: Keyframe[]) {
  if (value) keyframes.push(value)
}

export function driver(from: Frame, to: Frame, options?: Options) {
  const { withInversion, invertedAnimation, tweened, ...optionsWithDefaults } = withDefaults(options)
  const { forEachFrame, resolveVelocity, resolveValue } = createSpring(optionsWithDefaults)

  const keyframes: Keyframe[] = []
  const invertedKeyframes: Keyframe[] = []

  let lastFrame = 0

  const createKeyframe = makeCreateKeyframe(from, to, tweened, invertedAnimation)

  forEachFrame((value, index, done) => {
    pushValidKeyframes(createKeyframe(value, index, false), keyframes)
    if (withInversion) pushValidKeyframes(createKeyframe(value, index, true), invertedKeyframes)

    if (done) lastFrame = index
  }, withInversion)

  const toFrame = interpolate(0, lastFrame, 0, 100)

  return {
    ...createSprungKeyframes(keyframes, invertedKeyframes, toFrame),
    ...createTweenedKeyframes(from, to, tweened),
    duration: Math.round(msPerFrame * lastFrame * 100) / 100 + "ms",
    ease: EASE,
    resolveVelocity,
    resolveValues: resolveCurrentValues(resolveValue, from, to),
  }
}
