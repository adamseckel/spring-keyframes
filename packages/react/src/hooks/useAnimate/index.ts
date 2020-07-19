import { useRef, useEffect, useContext } from 'react'
import { Frame, tweenedProperties } from '@spring-keyframes/driver'
import { KeyframesContext } from '../../components/Keyframes'
import { Transition } from './types'
import { createAnimations } from './createAnimations'
import { computedStyle } from '../../utils/computedFrom'
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
}

export type Play = (props: AnimateToProps) => void

export interface Cache {
  start: number
  convert: ToApproxFn | null
  animation: string | null
  animations: Set<string>
  lastFrame: Frame | null
}

function setInversion(
  ref: React.MutableRefObject<HTMLElement | null>,
  animation: string
) {
  if (!ref.current) return
  if (!ref.current.childNodes[0]) return
  if (ref.current.childNodes[0].nodeType === 3) return
  ;(ref.current.childNodes[0] as HTMLElement).style.animation = animation
}

export function useAnimate({
  callback,
  state,
}: {
  state: AnimationState
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
  })

  const current = cache.current

  function handleAnimationEnd({ animationName }: { animationName: string }) {
    if (animationName !== current.animation) return
    if (animationName.includes('layout')) {
      if (!ref.current) return

      // Set styles here.
      ref.current.style.animation = ''
      ;(ref.current.childNodes[0] as HTMLElement).style.animation = ''
    }
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
    options?: Transition,
    preserve: boolean = false
  ) {
    if (!ref.current) return

    const velocity =
      current.start > 0 && current.convert ? current.convert(playTime) : 0
    if (interaction === Interaction.Tap) console.log(options)
    const { sprung, tweened, inverted, toApproxVelocity } = createAnimations({
      from,
      to,
      withDelay,
      options: {
        ...defaults,
        ...options,
        velocity,
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

    if (inverted?.name) setInversion(ref, inverted.animation)
    if (performance) current.start = performance.now()
    if (sprung) {
      current.animation = sprung.name
    } else if (tweened) {
      current.animation = tweened.name
    }

    current.lastFrame = to
  }

  const play = ({
    to,
    from,
    withDelay = false,
    interaction,
  }: AnimateToProps) => {
    if (!ref.current) return

    // This will animate too much. Maybe just need to use the "to" to fill in the "from"
    const style = computedStyle(Object.keys(to), ref)

    from = Object.assign({}, style, from)

    startAnimation(
      performance.now() - current.start,
      withDelay,
      to,
      from,
      interaction,
      state.current.options,
      state.current.preserve
    )
  }

  return { ref, play }
}
