import * as React from "react"
import { Frame, InvertedAnimation } from "@spring-keyframes/driver"
import { KeyframesContext } from "../../components/Keyframes"
import { Transition } from "./types"
import { createAnimations } from "./createAnimations"
import { Interaction, interactionPriority } from "../../utils/types"
import { createComputedFrame, createResolvedFrame } from "./createFrame"

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
export type GetCurrentTargetFrame = () => Frame | undefined

type Stack = Map<Interaction, Frame>

export interface Cache {
  start: number
  animation: string | null
  animations: string[]
  isAnimating: boolean
  isInverted: boolean
  lastInteraction: Interaction
  lastResolvedFrame?: Frame
  stack?: Stack
  resolveVelocity?: (time: number) => number
}

const requiresInversion = (interaction: Interaction, options?: Transition): boolean =>
  interaction === Interaction.Layout ? true : !!options?.withInversion
const getAnimationTime = (startTime: number) => performance.now() - startTime
const getVelocity = (isAnimating: boolean, animationTime: number, resolveVelocity?: (time: number) => number) =>
  isAnimating && resolveVelocity ? resolveVelocity(animationTime) : 0

const getNextInteraction = (candidate: Interaction, cache: Cache): Interaction => {
  if (candidate === Interaction.None) {
    if (!cache.lastInteraction) return Interaction.Base

    for (let index = cache.lastInteraction - 1; index > 0; index--) {
      const stackItem = cache.stack?.has(index)
      if (stackItem) return index
    }

    return Interaction.Base
  } else if (cache.lastInteraction && candidate < cache.lastInteraction) {
    return cache.lastInteraction
  } else {
    return candidate
  }
}

const getResolvedBase = (nextInteraction: Interaction, cache: Cache): Frame | undefined => {
  if (!cache.stack) return undefined

  const resolvedBase = {}
  for (let interaction = Interaction.Mount; interaction < nextInteraction; interaction++) {
    if (cache.stack.has(interaction)) Object.assign(resolvedBase, cache.stack.get(interaction))
  }

  return resolvedBase
}

export const Initial = Symbol("initial")

export interface UseDriver {
  animate: Animate
  resolveValues: ResolveValues
  getCurrentTargetFrame: GetCurrentTargetFrame
  isInverted: boolean
}

export function useDriver(
  ref: React.RefObject<HTMLElement>,
  callback?: () => void,
  readRef: React.RefObject<HTMLElement> = ref,
  invertedRef?: React.RefObject<HTMLElement>
): UseDriver {
  const { keyframes, flush } = React.useContext(KeyframesContext)

  const cache = React.useRef<Cache>({
    isAnimating: false,
    isInverted: false,
    start: 0,
    animation: null,
    animations: [],
    lastInteraction: Interaction.Base,
  })

  const resolveInteraction = React.useCallback((candidate: Interaction): Interaction => {
    const nextInteraction = getNextInteraction(candidate, cache.current)

    if (cache.current.lastInteraction && nextInteraction >= cache.current.lastInteraction) {
      return nextInteraction
    } else {
      for (let index = nextInteraction + 1; index < interactionPriority.length; index++) {
        cache.current.stack?.delete(index)
      }

      return nextInteraction
    }
  }, [])

  function handleAnimationEnd({ animationName }: { animationName: string }) {
    if (animationName !== cache.current.animation) return
    if (cache.current.lastInteraction === Interaction.Layout && ref.current) {
      ref.current.style.animation = ""
      if (invertedRef?.current) invertedRef.current.style.animation = ""
    }
    cache.current.isAnimating = false
    cache.current.start = 0

    if (cache.current.isInverted) cache.current.isInverted = false

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

    if (cache.current.lastInteraction === Interaction.Base) {
      cache.current.stack?.set(Interaction.Base, createComputedFrame(undefined, readRef))
    }
  }, [])

  const resolveValues = React.useCallback((from: Frame | undefined, to?: Frame, lastResolvedFrame?: Frame): {
    from: Frame
    to: Frame
    velocity: number
  } => {
    if (!ref.current) return { from: { scale: 1 }, to: { scale: 1 }, velocity: 0 }

    const { isAnimating, start, resolveVelocity } = cache.current
    const baseFrame = cache.current.stack?.get(Interaction.Base)
    const time = isAnimating ? getAnimationTime(start) : 0
    const velocity = getVelocity(isAnimating, time, resolveVelocity)

    return createResolvedFrame(ref, from, to, baseFrame, lastResolvedFrame, velocity, isAnimating)
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
      const nextInteraction = resolveInteraction(interaction)
      const withInversion = requiresInversion(interaction, options)
      const base =
        nextInteraction >= cache.current.lastInteraction
          ? cache.current.lastResolvedFrame
          : getResolvedBase(nextInteraction, cache.current)
      const { from: resolvedFrom, to: resolvedTo, velocity } = resolveValues(from, to, base)

      const animation = createAnimations(resolvedFrom, resolvedTo, !!withDelay, nextInteraction, {
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
      cache.current.lastInteraction = nextInteraction
      cache.current.lastResolvedFrame = resolvedTo
      cache.current.isAnimating = true

      if (to) cache.current.stack?.set(interaction, to)
      if (withInversion) cache.current.isInverted = true

      flush(cache.current.animations)

      cache.current.animations = []

      if (animation.sprung?.name) cache.current.animations.push(animation.sprung.name)
      if (animation.tweened?.name) cache.current.animations.push(animation.tweened.name)
      if (animation.inverted?.name) cache.current.animations.push(animation.inverted.name)
    },
    []
  )

  const getCurrentTargetFrame = React.useCallback(() => cache.current.lastResolvedFrame, [])

  return { animate, resolveValues, getCurrentTargetFrame, isInverted: cache.current.isInverted }
}
