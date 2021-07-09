import type * as React from "react"
import type { Frame, InvertedAnimation, Keyframe } from "@spring-keyframes/driver"
import type { Stack, Transition } from "./types"

import { Interaction, interactionPriority } from "./utils/Interaction"
import { createComputedFrame } from "./utils/createComputedFrame"
import { getNextStackInteraction } from "./utils/getNextStackInteraction"
import { resolveFrame } from "./utils/resolveFrame"
import { resolveBase } from "./utils/resolveBase"
import { waapiDriver as driver, EASE as ease } from "@spring-keyframes/driver"
import { filterTweenedProperties } from "./utils/filterTweenedProperties"

// const interactionFillMap: Record<Interaction, React.CSSProperties["animationFillMode"]> = {
//   [Interaction.Identity]: "none",
//   [Interaction.None]: "none",
//   [Interaction.Mount]: "backwards",
//   [Interaction.Animate]: "forwards",
//   [Interaction.Layout]: "none",
//   [Interaction.Hover]: "forwards",
//   [Interaction.Press]: "forwards",
//   [Interaction.Exit]: "forwards",
// }

const requiresInversion = (interaction: Interaction, options?: Transition): boolean =>
  interaction === Interaction.Layout ? true : !!options?.withInversion
const getVelocity = (isAnimating: boolean, animationTime: number, resolveVelocity?: (time: number) => number) =>
  isAnimating && resolveVelocity ? resolveVelocity(animationTime) : 0
const timingFunction = (isLinear: boolean, ease: string, sprung: boolean) => {
  if (isLinear) return "linear"
  if (sprung && !isLinear) return "cubic-bezier(1,1,0,0)"
  return ease
}

interface State {
  start: number
  leadAnimation: Animation | null
  duration: null | number
  animations: Animation[]
  isInverted: boolean
  lastInteraction: Interaction
  lastResolvedFrame?: Frame
  stack: Stack
  resolveVelocity?: (time: number) => number
}

interface ResolvedValues {
  from: Frame
  to: Frame
  velocity: number
}

export interface CreateAnimation {
  interaction: Interaction
  to?: Frame
  from?: Frame
  options?: Transition
  invertedAnimation?: InvertedAnimation
  _withDelay?: boolean
}

export class Driver {
  constructor(
    private readonly ref: React.RefObject<HTMLElement>,
    private readonly onComplete: () => void,
    private readonly invertedRef?: React.RefObject<HTMLElement>
  ) {}

  private state: State = {
    isInverted: false,
    start: 0,
    leadAnimation: null,
    animations: [],
    lastInteraction: Interaction.Identity,
    stack: new Map(),
    duration: null,
  }

  private resolveInteraction(candidate: Interaction): Interaction {
    const nextInteraction = getNextStackInteraction(candidate, this.state.stack, this.state.lastInteraction)

    if (this.state.lastInteraction && nextInteraction >= this.state.lastInteraction) {
      return nextInteraction
    }

    for (let index = nextInteraction + 1; index < interactionPriority.length; index++) {
      this.state.stack?.delete(index)
    }

    return nextInteraction
  }

  get inverted() {
    return this.state.isInverted
  }

  get targetFrame() {
    return this.state.lastResolvedFrame
  }

  init = () => {
    if (this.state.lastInteraction !== Interaction.Identity) return
    this.state.stack?.set(Interaction.Identity, createComputedFrame(undefined, this.ref))
  }

  resolveValues = ({ from, to, base }: { from?: Frame; to?: Frame; base?: Frame }): ResolvedValues => {
    if (!this.ref.current) return { from: { scale: 1 }, to: { scale: 1 }, velocity: 0 }

    const { resolveVelocity } = this.state
    const identity = this.state.stack?.get(Interaction.Identity)

    const currentTime =
      (this.state.leadAnimation && this.state.leadAnimation.currentTime && this.state.leadAnimation.currentTime) ?? 0

    const isAnimating = currentTime > 0
    const velocity = getVelocity(isAnimating, this.state.duration ?? 0 - currentTime, resolveVelocity)

    return resolveFrame(
      this.ref,
      from,
      to,
      { identity, base, lastFrame: this.state.lastResolvedFrame },
      velocity,
      isAnimating
    )
  }

  animate = ({ to, from, interaction, invertedAnimation, options = {} }: CreateAnimation): void => {
    if (this.state.animations.length)
      console.log("interupt", this.state.leadAnimation?.currentTime, this.state.duration)

    const nextInteraction = this.resolveInteraction(interaction)
    const withInversion = requiresInversion(interaction, options)
    const base =
      nextInteraction >= this.state.lastInteraction
        ? this.state.lastResolvedFrame
        : resolveBase(nextInteraction, this.state.stack)

    const { from: resolvedFrom, to: resolvedTo, velocity } = this.resolveValues({ from, to, base })

    const { sprung, tweened } = filterTweenedProperties(resolvedFrom, resolvedTo, options.tweened)

    let invertedTween: Keyframe[] | undefined = undefined
    if (invertedAnimation) {
      const result = filterTweenedProperties(invertedAnimation.from, invertedAnimation.to)
      if (result.sprung) invertedAnimation = result.sprung
      if (result.tweened) invertedTween = [result.tweened.from, result.tweened.to]
    }

    console.log(sprung, tweened)
    // const delay = options.delay && withDelay ? `${options.delay}ms` : "0ms"
    // const fill = interactionFillMap[nextInteraction]

    const allAnimations: {
      sprung?: Keyframe[]
      inversion?: Keyframe[]
      tween?: Keyframe[]
      inversionTween?: Keyframe[]
    } = {}

    let duration = options.duration ?? 0

    if (sprung) {
      const animation = driver(sprung.from, sprung.to, {
        ...options,
        velocity,
        withInversion,
        invertedAnimation,
      })

      duration = animation.duration

      if (animation.keyframes) allAnimations.sprung = animation.keyframes
      if (animation.inversions) allAnimations.inversion = animation.inversions
      this.state.resolveVelocity = animation.resolveVelocity
    }

    console.log(allAnimations)

    if (tweened) allAnimations.tween = [tweened.from, tweened.to]
    if (invertedTween) allAnimations.inversionTween = invertedTween

    const animations: Animation[] = []
    for (const animationType in allAnimations) {
      const element =
        animationType === "inversion" || animationType === "inversionTween"
          ? this.invertedRef?.current
          : this.ref.current

      if (!element) continue

      const effects = allAnimations[animationType as keyof typeof allAnimations]
      if (!effects) continue

      const animation = element.animate(effects, {
        duration,
        easing: timingFunction(withInversion, ease, animationType === "sprung"),
      })
      if (!animation) continue

      animations.push(animation)
      this.state.leadAnimation = animation
      this.state.duration = duration

      animation.addEventListener("finish", () => {
        this.onComplete()
        this.state.isInverted = false
      })
    }

    this.state.lastInteraction = nextInteraction
    this.state.lastResolvedFrame = resolvedTo

    if (interaction !== Interaction.None) this.state.stack.set(interaction, to || {})
    if (withInversion) this.state.isInverted = true

    this.state.animations.forEach((animation) => animation.cancel())
    this.state.animations = animations
  }
}
