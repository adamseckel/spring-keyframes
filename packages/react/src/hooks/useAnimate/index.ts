import { useRef, useEffect, useContext } from 'react'
import {
  Frame,
  tweenedProperties,
  InvertedAnimation,
} from '@spring-keyframes/driver'
import { KeyframesContext } from '../../components/Keyframes'
import { Transition } from './types'
import { createAnimations } from './createAnimations'
import {
  computedStyle,
  computedStyleForElement,
} from '../../utils/computedFrom'
import { axisScaleForFrame } from '../../utils/createDelta'
import { Interaction } from '../../utils/types'
import { AnimationState } from '../useAnimationState'

export { Transition }

type ToApproxFn = (v: number) => number

interface AnimateToProps {
  from?: Frame
  to: Frame
  withDelay?: boolean
  interaction: Interaction
  options?: Transition
  invertedAnimation?: InvertedAnimation
}

export type Play = (props: AnimateToProps) => void

export interface Cache {
  start: number
  convert: ToApproxFn | null
  animation: string | null
  animations: Set<string>
  lastFrame: Frame | null
  lastInteractionType: Interaction | null
}

const identity = {
  scaleX: 1,
  scaleY: 1,
}

function setInversion(
  ref: React.MutableRefObject<HTMLElement | null>,
  animation: string,
  invertedAnimation?: InvertedAnimation
) {
  if (!ref.current) return
  if (!ref.current.childNodes[0]) return
  if (ref.current.childNodes[0].nodeType === 3) return
  ;(ref.current.childNodes[0] as HTMLElement).style.animation = animation
  if (!invertedAnimation) return

  // const { scale, scaleX, scaleY } = invertedAnimation.to

  // if (scale) {
  //   const transform = createTransformString({ scale })
  //   ;(ref.current.childNodes[0] as HTMLElement).style.transform = transform
  //   return
  // }

  // const transform = createTransformString({ scaleX, scaleY })
  // ;(ref.current.childNodes[0] as HTMLElement).style.transform = transform
  return
}

function requiresInvertedScale(interaction: Interaction, options?: Transition) {
  if (interaction === Interaction.Layout) return true
  return options?.withInvertedScale
}

function createInvertedFrom(
  ref: React.MutableRefObject<HTMLElement | null>,
  from: Frame
) {
  if (!ref.current) return identity

  const inverted = computedStyleForElement(
    ['scaleX', 'scaleY'],
    ref.current.childNodes[0] as HTMLElement
  )

  return {
    scaleX: (from?.scaleX || 1) * (inverted?.scaleX || 1),
    scaleY: (from?.scaleY || 1) * (inverted?.scaleY || 1),
  }
}

function createIdentityTo(distortion?: Frame) {
  if (distortion) {
    const { scale = 1 } = distortion
    const { scaleX = scale, scaleY = scale } = distortion
    return { scaleX, scaleY }
  }
  return identity
}

export function useAnimate({
  callback,
  updateIsInverted,
  state,
}: {
  state: AnimationState
  updateIsInverted: (inverted: boolean) => void
  callback?: () => void
}): {
  play: Play
  ref: React.MutableRefObject<HTMLElement | null>
} {
  const ref = useRef<HTMLElement>(null)
  const { keyframes, flush } = useContext(KeyframesContext)

  const cache = useRef<Cache>({
    start: 0,
    convert: null,
    animation: null,
    animations: new Set(),
    lastFrame: null,
    lastInteractionType: null,
  })

  const current = cache.current

  function handleAnimationEnd({ animationName }: { animationName: string }) {
    if (animationName !== current.animation) return
    if (
      cache.current.lastInteractionType === Interaction.Layout &&
      ref.current
    ) {
      ref.current.style.animation = ''
      ;(ref.current.childNodes[0] as HTMLElement).style.animation = ''
    }
    // Only exit out of inverting if the animation completes.
    if (state.current.isInverted) updateIsInverted(false)

    current.start = 0
    callback && callback()
  }

  useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener('animationend', handleAnimationEnd)

    return () => {
      if (!ref.current) return
      ref.current.removeEventListener('animationend', handleAnimationEnd)

      flush(Array.from(current.animations))
    }
  }, [])

  const defaults = {
    stiffness: 380,
    damping: 20,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    tweenedProps: tweenedProperties,
  }

  function startAnimation(
    playTime: number,
    withDelay: boolean,
    to: Frame,
    from: Frame,
    interaction: Interaction,
    invertedAnimation?: InvertedAnimation,
    options?: Transition,
    preserve: boolean = false
  ) {
    if (!ref.current) return

    const velocity =
      current.start > 0 && current.convert ? current.convert(playTime) : 0

    const withInvertedScale = requiresInvertedScale(interaction, options)

    if (state.current.isInverted && !invertedAnimation && !withInvertedScale) {
      invertedAnimation = {
        from: createInvertedFrom(ref, from),
        to: createIdentityTo(state.current.distortion),
      }
    }

    const { sprung, tweened, inverted, toApproxVelocity } = createAnimations({
      from,
      to,
      withDelay,
      options: {
        ...defaults,
        ...options,
        velocity,
        withInvertedScale,
        invertedAnimation,
      },
      keyframes,
      interaction,
      preserve,
    })

    if (sprung?.name) cache.current.animations.add(sprung.name)
    if (tweened?.name) cache.current.animations.add(tweened.name)
    if (inverted?.name) cache.current.animations.add(inverted.name)

    current.convert = toApproxVelocity

    ref.current.style.animation = [sprung?.animation, tweened?.animation]
      .filter((t) => t)
      .join(', ')

    if (inverted?.name) {
      setInversion(ref, inverted.animation, invertedAnimation)
      updateIsInverted(true)
    } else {
      updateIsInverted(false)
    }
    if (performance) current.start = performance.now()
    if (sprung) {
      current.animation = sprung.name
    } else if (tweened) {
      current.animation = tweened.name
    }
    current.lastInteractionType = interaction
    current.lastFrame = to
  }

  const play = ({
    to,
    from,
    withDelay = false,
    interaction,
    invertedAnimation,
  }: AnimateToProps) => {
    if (!ref.current) return

    const additionalKeys = state.current.isInverted
      ? Object.keys(identity)
      : undefined

    const keys = [...Object.keys(to), ...(additionalKeys ? additionalKeys : [])]

    const style = computedStyle(keys, ref)

    from = Object.assign({}, style, from)
    to = Object.assign({}, to, additionalKeys ? axisScaleForFrame(to) : {})

    if (additionalKeys) {
      delete to.scale
      delete from.scale
    }

    startAnimation(
      performance.now() - current.start,
      withDelay,
      to,
      from,
      interaction,
      invertedAnimation,
      state.current.options,
      state.current.preserve
    )
  }

  return { ref, play }
}
