import hash from "@emotion/hash"
import { driver, Frame } from "@spring-keyframes/driver"
import { Transition } from "./types"
import { Interaction } from "../../utils/types"

const toTimingFunction = (isLinear: boolean, ease: string) => (sprung?: boolean) => {
  if (sprung && isLinear) return "linear"
  return ease
}

interface Animation {
  name: string
  animation: string
}
interface Animations {
  sprung?: Animation
  tweened?: Animation
  inverted?: Animation
}

function processFrameToAnimations(
  keyframes: (name: string, rule: string) => string,
  allAnimations: { sprung?: string; tweened?: string; inverted?: string },
  hashed: string,
  toAnimation: (name: string, isSprung: boolean) => string,
  interaction: Interaction
) {
  const animations: Animations = {}

  for (const animationName in allAnimations) {
    const animation = allAnimations[animationName as keyof Animations]

    if (!animation) continue

    const n = `s${hashed}-${animationName}-${interaction}`
    keyframes(n, animation)

    const isSprung = animationName !== "tweened"

    animations[animationName as keyof Animations] = {
      name: n,
      animation: toAnimation(n, isSprung),
    }
  }

  return animations
}

const interactionFillMap: Record<Interaction, React.CSSProperties["animationFillMode"]> = {
  [Interaction.Mount]: "backwards",
  [Interaction.Animate]: "forwards",
  [Interaction.Layout]: "none",
  [Interaction.Hover]: "forwards",
  [Interaction.HoverEnd]: "none",
  [Interaction.Tap]: "forwards",
  [Interaction.TapEnd]: "none",
  [Interaction.TapEndHover]: "forwards",
  [Interaction.Exit]: "forwards",
}

export const createAnimations = (
  from: Frame,
  to: Frame,
  withDelay: boolean,
  interaction: Interaction,
  options: Transition
) => (keyframes: (name: string, rule: string) => string) => {
  const { duration, ease, resolveVelocity, resolveValues, ...allAnimations } = driver(from, to, options)

  const delay = options.delay && withDelay ? `${options.delay}ms` : "0ms"
  const fill = interactionFillMap[interaction]

  const timing = toTimingFunction(!!options.withInversion, ease)

  const toAnimation = (name: string, sprung: boolean) => `${name} ${timing(sprung)} ${duration} ${delay} 1 ${fill}`
  console.log({ allAnimations })
  const hashedName = hash(JSON.stringify({ to, from, options }))
  const animations = processFrameToAnimations(keyframes, allAnimations, hashedName, toAnimation, interaction)

  return { ...animations, resolveVelocity, resolveValues }
}
