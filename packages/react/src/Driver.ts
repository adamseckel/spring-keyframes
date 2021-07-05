import type * as React from "react"
import type { Frame, InvertedAnimation } from "@spring-keyframes/driver"
import type { Stack, Transition } from "./types"

import { Keyframes } from "../src/components/Keyframes"
import { Interaction, interactionPriority } from "./utils/Interaction"
import { createComputedFrame } from "./utils/createComputedFrame"
import { getNextStackInteraction } from "./utils/getNextStackInteraction"
import { resolveFrame } from "./utils/resolveFrame"
import { resolveBase } from "./utils/resolveBase"
import { driver } from "@spring-keyframes/driver"

const interactionFillMap: Record<Interaction, React.CSSProperties["animationFillMode"]> = {
  [Interaction.Identity]: "none",
  [Interaction.None]: "none",
  [Interaction.Mount]: "backwards",
  [Interaction.Animate]: "forwards",
  [Interaction.Layout]: "none",
  [Interaction.Hover]: "forwards",
  [Interaction.Press]: "forwards",
  [Interaction.Exit]: "forwards",
}

const requiresInversion = (interaction: Interaction, options?: Transition): boolean =>
  interaction === Interaction.Layout ? true : !!options?.withInversion
const getAnimationTime = (startTime: number) => performance.now() - startTime
const getVelocity = (isAnimating: boolean, animationTime: number, resolveVelocity?: (time: number) => number) =>
  isAnimating && resolveVelocity ? resolveVelocity(animationTime) : 0
const timingFunction = (isLinear: boolean, ease: string, sprung: boolean) => {
  if (isLinear) return "linear"
  if (sprung && !isLinear) return "cubic-bezier(1,1,0,0)"
  return ease
}

interface State {
  start: number
  animation: string | null
  animations: string[]
  isAnimating: boolean
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
  withDelay?: boolean
}

export class Driver {
  constructor(
    private readonly ref: React.RefObject<HTMLElement>,
    private readonly keyframes: Keyframes,
    private readonly createAnimation: (animations: string[], inversion: string | false | undefined) => void
  ) {}

  private state: State = {
    isAnimating: false,
    isInverted: false,
    start: 0,
    animation: null,
    animations: [],
    lastInteraction: Interaction.Identity,
    stack: new Map(),
  }

  private resolveInteraction(candidate: Interaction): Interaction {
    const nextInteraction = getNextStackInteraction(candidate, this.state.stack, this.state.lastInteraction)
    // console.log({ nextInteraction })

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

  get animationName() {
    return this.state.animation
  }

  init = () => {
    if (this.state.lastInteraction !== Interaction.Identity) return
    this.state.stack?.set(Interaction.Identity, createComputedFrame(undefined, this.ref))
  }

  reset = () => {
    this.state.isAnimating = false
    this.state.start = 0
    this.state.isInverted = false
    this.keyframes.flush(this.state.animations)
  }

  resolveValues = ({ from, to, base }: { from?: Frame; to?: Frame; base?: Frame }): ResolvedValues => {
    if (!this.ref.current) return { from: { scale: 1 }, to: { scale: 1 }, velocity: 0 }

    const { isAnimating, start, resolveVelocity } = this.state
    const identity = this.state.stack?.get(Interaction.Identity)
    const time = isAnimating ? getAnimationTime(start) : 0
    const velocity = getVelocity(isAnimating, time, resolveVelocity)

    return resolveFrame(
      this.ref,
      from,
      to,
      { identity, base, lastFrame: this.state.lastResolvedFrame },
      velocity,
      isAnimating
    )
  }

  animate = ({ to, from, interaction, invertedAnimation, options = {}, withDelay }: CreateAnimation): void => {
    const nextInteraction = this.resolveInteraction(interaction)
    const withInversion = requiresInversion(interaction, options)
    const base =
      nextInteraction >= this.state.lastInteraction
        ? this.state.lastResolvedFrame
        : resolveBase(nextInteraction, this.state.stack)

    const { from: resolvedFrom, to: resolvedTo, velocity } = this.resolveValues({ from, to, base })
    // console.log({ interaction, nextInteraction, base, from, resolvedFrom, to, resolvedTo }, this.state)
    const delay = options.delay && withDelay ? `${options.delay}ms` : "0ms"
    const fill = interactionFillMap[nextInteraction]
    const animation = driver(resolvedFrom, resolvedTo, {
      ...options,
      velocity,
      withInversion,
      invertedAnimation,
    })
    const allAnimations = [animation.sprung, animation.tweened, animation.inverted]
    const animationNames: string[] = []
    const animations = []
    let inversion: string | undefined = undefined

    const timestamp = performance?.now() ?? new Date().getTime()
    const key = Math.random().toString(36).substring(5)
    for (let index = 0; index < allAnimations.length; index++) {
      const keyframes = allAnimations[index]
      if (!keyframes) continue

      const name = `s-${key}-${index}-${interaction}`

      const string = `${name} ${timingFunction(withInversion, animation.ease, index !== 1)} ${
        animation.duration
      } ${delay} 1 ${fill}`

      animationNames.push(name)

      this.keyframes.create(name, keyframes)

      if (index === 2) {
        inversion = string
        continue
      }

      animations.push(string)
    }

    this.state.resolveVelocity = animation.resolveVelocity

    this.createAnimation(animations, withInversion && inversion)

    this.state.start = timestamp
    this.state.animation = animationNames[0]
    this.state.lastInteraction = nextInteraction
    this.state.lastResolvedFrame = resolvedTo
    this.state.isAnimating = true
    if (interaction !== Interaction.None) this.state.stack.set(interaction, to || {})
    if (withInversion) this.state.isInverted = true

    this.keyframes.flush(this.state.animations)

    this.state.animations = animations
    if (inversion) this.state.animations.push(inversion)

    // console.log(this.state)
  }
}
