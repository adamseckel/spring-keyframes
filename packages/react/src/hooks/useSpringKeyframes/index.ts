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
  animations: Set<string>
  isAnimating: boolean
  lastFrame?: Frame
  baseComputedStyle?: Frame
  lastInteractionType?: Interaction
  resolveVelocity?: (time: number) => number
  resolveValues?: (time: number) => Frame
}

// const identity = {
//   scaleX: 1,
//   scaleY: 1,
// }

function requiresInversion(interaction: Interaction, options?: Transition) {
  if (interaction === Interaction.Layout) return true
  return options?.withInversion
}

// function createInvertedFrom(ref: React.MutableRefObject<HTMLElement | null>, from: Frame) {
//   if (!ref.current) return identity

//   const inverted = computedStyleForElement(["scaleX", "scaleY"], ref.current.childNodes[0] as HTMLElement)

//   return {
//     scaleX: (from?.scaleX || 1) * (inverted?.scaleX || 1),
//     scaleY: (from?.scaleY || 1) * (inverted?.scaleY || 1),
//   }
// }

// function createIdentityTo(distortion?: Frame) {
//   if (distortion) {
//     const { scale = 1 } = distortion
//     const { scaleX = scale, scaleY = scale } = distortion
//     return { scaleX, scaleY }
//   }
//   return identity
// }

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
    animations: new Set(),
  })

  function handleAnimationEnd({ animationName }: { animationName: string }) {
    if (animationName !== cache.current.animation) return
    if (cache.current.lastInteractionType === Interaction.Layout && ref.current) {
      ref.current.style.animation = ""
      if (invertedRef?.current) invertedRef.current.style.animation = ""
    }
    cache.current.isAnimating = false
    cache.current.start = 0

    callback?.()
  }

  React.useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener("animationend", handleAnimationEnd)

    return () => {
      if (!ref.current) return

      ref.current.removeEventListener("animationend", handleAnimationEnd)
      flush(Array.from(cache.current.animations))
    }
  }, [])

  React.useLayoutEffect(() => {
    if (!ref.current) return

    if (!cache.current.lastFrame) {
      cache.current.baseComputedStyle = computedFrame(undefined, ref)
    }
  }, [])

  const resolveValues = React.useCallback((from: Frame | undefined, to?: Frame): {
    from: Frame
    to: Frame
    velocity: number
  } => {
    if (!ref.current) return { from: { scale: 1 }, to: { scale: 1 }, velocity: 0 }

    const { isAnimating, start, resolveVelocity, resolveValues, baseComputedStyle, lastFrame } = cache.current
    const time = isAnimating ? getAnimationTime(start) : 0
    const velocity = getVelocity(isAnimating, time, resolveVelocity)

    // If a specific From and To Frame are provided, use them both. We assume
    // they match.
    if (from && to) {
      // console.log("a")

      return { from, to, velocity }
    }

    if (baseComputedStyle) {
      // If From is provided but To is not, we assume the target animation is to
      // the base style.
      if (from && !to) {
        console.log("b")
        return { from, to: onlyTargetProperties(from, baseComputedStyle), velocity }
      }
      // If To is provided but From is not, we assume we are animating from
      // current styles, to To.
      if (!from && to) {
        /**@TODO is there a scenario where we need to merge computed style and resolved values */
        if (isAnimating && resolveValues) {
          console.log("c", time, resolveValues(time))
          return { from: onlyTargetProperties(to, resolveValues(time)), to, velocity }
        }

        if (!isAnimating && lastFrame && resolveValues) {
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
        if (isAnimating && resolveValues) {
          console.log("f")
          return { from: resolveValues(time), to: onlyTargetProperties(lastFrame, baseComputedStyle), velocity }
        }

        console.log("g")
        return { from: lastFrame, to: onlyTargetProperties(lastFrame, baseComputedStyle), velocity }
      }
    }

    return { from: { scale: 1 }, to: { scale: 1 }, velocity }
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
      // console.log({ resolvedFrom, resolvedTo, velocity })
      console.log({ withInversion })
      const animation = createAnimations(resolvedFrom, resolvedTo, !!withDelay, interaction, {
        ...options,
        velocity,
        withInversion,
        invertedAnimation,
      })(keyframes)

      console.log(animation)

      if (animation.sprung?.name) cache.current.animations.add(animation.sprung.name)
      if (animation.tweened?.name) cache.current.animations.add(animation.tweened.name)
      if (animation.inverted?.name) cache.current.animations.add(animation.inverted.name)

      cache.current.resolveVelocity = animation.resolveVelocity
      cache.current.resolveValues = animation.resolveValues

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
    },
    []
  )

  return { animate, resolveValues }
}
