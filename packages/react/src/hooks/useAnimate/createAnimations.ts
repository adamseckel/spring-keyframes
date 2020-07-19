import hash from '@emotion/hash'
import {
  driver,
  Frame,
  Property,
  tweenedProperties,
} from '@spring-keyframes/driver'
import { Transition } from './types'
import { Interaction } from '../../utils/types'

const defaults: Transition = {
  stiffness: 380,
  damping: 20,
  mass: 1,
  precision: 0.01,
  velocity: 0,
  tweenedProps: tweenedProperties,
  type: 'spring',
  timingFunction: 'cubic-bezier(0.15, 0, 0, 1)',
  withEveryFrame: false,
  withInvertedScale: false,
}

const toTimingFunction = (
  isEase: boolean,
  isLinear: boolean,
  ease: string,
  userTimingFunction: string
) => (sprung?: boolean) => {
  if (isEase) return userTimingFunction
  if (sprung && isLinear) return 'linear'
  if (sprung && !isLinear) return ease

  return userTimingFunction
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

interface AnimatedClass {
  from: Frame
  to: Frame
  withDelay?: boolean
  options?: Transition
  keyframes: (name: string, rule: string) => string
  interaction: Interaction
  preserve: boolean
}

function processFrameToAnimations(
  keyframes: AnimatedClass['keyframes'],
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

    const isSprung = animationName !== 'tweened'

    animations[animationName as keyof Animations] = {
      name: n,
      animation: toAnimation(n, isSprung),
    }
  }

  return animations
}

const interactionFillMap: Record<
  Interaction,
  React.CSSProperties['animationFillMode']
> = {
  [Interaction.Layout]: 'none',
  [Interaction.Mount]: 'both',
  [Interaction.Tap]: 'forwards',
  [Interaction.Hover]: 'forwards',
  [Interaction.Exit]: 'both',
  [Interaction.Animate]: 'none',
}

export function createAnimations({
  from,
  to,
  withDelay,
  options = {},
  keyframes,
  interaction,
  preserve,
}: AnimatedClass) {
  const {
    stiffness,
    damping,
    mass,
    precision,
    delay,
    tweenedProps: toTween,
    duration,
    type,
    timingFunction,
    withInvertedScale,
    withEveryFrame,
  } = {
    ...defaults,
    ...options,
  } as Required<Transition>

  const tweenedProps =
    type === 'ease' ? (Object.keys(to) as Property[]) : toTween

  const {
    duration: springDuration,
    ease,
    playTimeToVelocity,
    ...allAnimations
  } = driver(from, to, {
    stiffness,
    damping,
    mass,
    precision,
    withInvertedScale,
    withEveryFrame,
    tweenedProps,
  })

  // @TODO: Optionally use window.matchMedia to use tweened animations only if "prefers-reduced-motion" is "reduce".
  const aDuration = duration ? duration + 'ms' : springDuration
  const aDelay = delay && withDelay ? `${delay}ms` : '0ms'
  const fill = preserve ? 'forwards' : interactionFillMap[interaction]

  const timing = toTimingFunction(
    type === 'ease',
    withEveryFrame || withInvertedScale,
    ease,
    timingFunction
  )

  const toAnimation = (name: string, sprung: boolean) =>
    `${name} ${timing(sprung)} ${aDuration} ${aDelay} 1 ${fill}`

  const hashedName = hash(
    JSON.stringify({
      to,
      from,
      options: {
        ...options,
        tweenedProps,
      },
    })
  )

  const animations = processFrameToAnimations(
    keyframes,
    allAnimations,
    hashedName,
    toAnimation,
    interaction
  )

  return {
    ...animations,
    toApproxVelocity: playTimeToVelocity,
  }
}
