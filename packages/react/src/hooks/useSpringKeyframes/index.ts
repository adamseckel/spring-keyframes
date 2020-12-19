import * as React from "react"
import { Frame, InvertedAnimation } from "@spring-keyframes/driver"
import { KeyframesContext } from "../../components/Keyframes"
import { Transition } from "./types"
import { createAnimations } from "./createAnimations"
import { Interaction } from "../../utils/types"
import { computedFrame, onlyTargetProperties } from "./computedFrame"

export { Transition }

export type Animate = (
  to: Frame | undefined,
  interaction: Interaction,
  from?: Frame,
  invertedAnimation?: InvertedAnimation,
  options?: Transition,
  withDelay?: boolean
) => void

export type ResolveValues = (to: Frame | undefined, from?: Frame) => { from: Frame; to: Frame; velocity: number }

export interface Cache {
  start: number
  animation: string | null
  animations: string[]
  isAnimating: boolean
  lastFrame?: Frame
  baseComputedStyle?: Frame
  lastInteractionType?: Interaction
  resolveVelocity?: (time: number) => number
}

function requiresInversion(interaction: Interaction, options?: Transition) {
  if (interaction === Interaction.Layout) return true
  return options?.withInversion
}

function getAnimationTime(startTime: number) {
  return performance.now() - startTime
}

function getVelocity(isAnimating: boolean, animationTime: number, resolveVelocity?: (time: number) => number) {
  if (isAnimating && resolveVelocity) return resolveVelocity(animationTime)

  return 0
}

export const Initial = Symbol("initial")

export function useSpringKeyframes(
  ref: React.RefObject<HTMLElement>,
  callback?: () => void,
  readRef: React.RefObject<HTMLElement> = ref,
  invertedRef?: React.RefObject<HTMLElement>
): {
  animate: Animate
  resolveValues: ResolveValues
} {
  const { keyframes, flush } = React.useContext(KeyframesContext)

  const cache = React.useRef<Cache>({
    isAnimating: false,
    start: 0,
    animation: null,
    animations: [],
  })

  function handleAnimationEnd({ animationName }: { animationName: string }) {
    if (animationName !== cache.current.animation) return
    if (cache.current.lastInteractionType === Interaction.Layout && ref.current) {
      ref.current.style.animation = ""
      if (invertedRef?.current) invertedRef.current.style.animation = ""
    }
    cache.current.isAnimating = false
    cache.current.start = 0

    flush(cache.current.animations)

    callback?.()
  }

  React.useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener("animationend", handleAnimationEnd)

    return () => {
      if (!ref.current) return

      ref.current.removeEventListener("animationend", handleAnimationEnd)
    }
  }, [])

  React.useLayoutEffect(() => {
    if (!readRef.current) return

    if (!cache.current.lastFrame) {
      cache.current.baseComputedStyle = computedFrame(undefined, readRef)
    }
  }, [])

  const resolveValues = React.useCallback((from: Frame | undefined, to?: Frame): {
    from: Frame
    to: Frame
    velocity: number
  } => {
    if (!ref.current) return { from: { scale: 1 }, to: { scale: 1 }, velocity: 0 }

    const { isAnimating, start, resolveVelocity, baseComputedStyle, lastFrame } = cache.current
    const time = isAnimating ? getAnimationTime(start) : 0
    const velocity = getVelocity(isAnimating, time, resolveVelocity)

    // If a specific From and To Frame are provided, use them both. We assume
    // they match.
    if (from && to) {
      return { from, to, velocity }
    }

    if (baseComputedStyle) {
      // If From is provided but To is not, we assume the target animation is to
      // the base style.
      if (from && !to) {
        return { from, to: onlyTargetProperties(from, baseComputedStyle), velocity }
      }
      // If To is provided but From is not, we assume we are animating from
      // current styles, to To.
      if (!from && to) {
        /**@TODO is there a scenario where we need to merge computed style and resolved values */
        if (isAnimating) {
          console.log("c")
          return { from: computedFrame(to, ref), to, velocity }
        }

        if (!isAnimating && lastFrame) {
          console.log("d")
          return { from: onlyTargetProperties(to, { ...baseComputedStyle, ...lastFrame }), to, velocity }
        } else if (!isAnimating) {
          console.log("e")
          return { from: onlyTargetProperties(to, baseComputedStyle), to, velocity }
        }
      }

      // Finally, if neither From or To are provided, and we have previously
      // animated to a specific Frame, we animate from that Frame to the base
      // style.
      if (!from && !to && lastFrame) {
        if (isAnimating) {
          return {
            from: computedFrame(lastFrame, ref),
            to: onlyTargetProperties(lastFrame, baseComputedStyle),
            velocity,
          }
        }

        return { from: lastFrame, to: onlyTargetProperties(lastFrame, baseComputedStyle), velocity }
      }
    }

    return { from: {}, to: {}, velocity }
  }, [])

  const animate = React.useCallback(
    (
      to: Frame | undefined,
      interaction: Interaction,
      from?: Frame,
      invertedAnimation?: InvertedAnimation,
      options?: Transition,
      withDelay?: boolean
    ): void => {
      if (!ref.current) return

      const withInversion = requiresInversion(interaction, options)
      const { from: resolvedFrom, to: resolvedTo, velocity } = resolveValues(from, to)

      const animation = createAnimations(resolvedFrom, resolvedTo, !!withDelay, interaction, {
        ...options,
        velocity,
        withInversion,
        invertedAnimation,
      })(keyframes)

      cache.current.resolveVelocity = animation.resolveVelocity

      ref.current.style.animation = [animation.sprung?.animation, animation.tweened?.animation]
        .filter((t) => !!t)
        .join(", ")

      if (withInversion && invertedRef?.current && animation.inverted?.animation)
        invertedRef.current.style.animation = animation.inverted.animation

      if (performance) cache.current.start = performance.now()

      cache.current.animation = animation.sprung?.name || animation.tweened?.name || null
      cache.current.lastInteractionType = interaction
      cache.current.lastFrame = to
      cache.current.isAnimating = true

      flush(cache.current.animations)

      cache.current.animations = []

      if (animation.sprung?.name) cache.current.animations.push(animation.sprung.name)
      if (animation.tweened?.name) cache.current.animations.push(animation.tweened.name)
      if (animation.inverted?.name) cache.current.animations.push(animation.inverted.name)
    },
    []
  )

  return { animate, resolveValues }
}
