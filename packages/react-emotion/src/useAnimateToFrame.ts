import { useRef, useEffect } from 'react'
import { keyframes } from 'emotion'
import {
  default as spring,
  Frame,
  Options,
  Property,
  tweenedProperties,
} from '@spring-keyframes/driver'
import Unmatrix from './unmatrix'

const unmatrix = new Unmatrix()

export interface Transition extends Options {
  /** Duration to delay initial animations in ms. Will not prevent child animations from playing. */
  delay?: number
  /** Duration to run all animations in ms. */
  duration?: number
  type?: 'spring' | 'ease'
  easeFn?: string
}

type TransformProperty =
  | 'translateX'
  | 'translateY'
  | 'translateZ'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'

const defaults = {
  stiffness: 380,
  damping: 20,
  mass: 1,
  precision: 0.01,
  velocity: 0,
  tweenedProps: tweenedProperties,
  type: 'spring',
  easeFn: 'cubic-bezier(0.15, 0, 0, 1)',
}

function animatedClass({
  from,
  to,
  withDelay,
  options = {},
}: {
  from: Frame
  to: Frame
  withDelay?: boolean
  options?: Transition
}): {
  animation: string
  animationName: string
  toApproxVelocity: (v: number) => number
} {
  const {
    stiffness,
    damping,
    mass,
    precision,
    delay,
    tweenedProps,
    duration,
    type,
    easeFn,
  } = {
    ...defaults,
    ...options,
  }

  const [frames, springDuration, ease, toApproxVelocity] = spring(from, to, {
    stiffness,
    damping,
    mass,
    precision,
    tweenedProps:
      type === 'ease' ? (Object.keys(from) as Property[]) : tweenedProps,
  })

  // @TODO: Optionally use window.matchMedia to use tweened animations only if "prefers-reduced-motion" is "reduce".
  const animations = frames.map(animation => keyframes`${animation}`)
  const animationDuration = duration ? duration + 'ms' : springDuration
  const animationDelay = delay && withDelay ? `${delay}ms` : '0ms'

  const animationName = type === 'ease' ? animations[1] : animations[0]

  const animateEaseFn = (i: number) =>
    type === 'ease' ? easeFn : i === 0 ? ease : easeFn
  const toAnimationString = (a: string, i: number) =>
    `${a} ${animateEaseFn(i)} ${animationDuration} ${animationDelay} 1 both`

  return {
    animation: animations.map(toAnimationString).join(', '),
    animationName,
    toApproxVelocity,
  }
}

function computedFrom(to: Frame, ref: React.MutableRefObject<Element | null>) {
  if (!ref.current) return {} as Frame

  // @TODO: Optionally infer unset from from element style.
  const frame: Frame = {}
  const style = getComputedStyle(ref.current)
  const frameTransforms: Partial<Record<TransformProperty, any>> =
    unmatrix.getTransform(style) || {}

  const keys = Object.keys(to) as Property[]

  keys.forEach(key => {
    // @ts-ignore
    if (frameTransforms[key] !== undefined) {
      //@ts-ignore
      frame[key] = frameTransforms[key]
    } else if (key === 'scale') {
      frame[key] = frameTransforms.scaleX
    } else if (key === 'y') {
      frame[key] = frameTransforms.translateY
    } else if (key === 'x') {
      frame[key] = frameTransforms.translateX

      // Must come last as computedStyle has x and y keys that clash with transform shorthand.
    } else if (style[key as any]) {
      frame[key] = parseFloat(style[key as any])
    }
  })
  return frame
}

interface Props {
  from: Frame
  to: Frame
  options: Transition
  onEnd?: () => void
}

type toApproxFn = (v: number) => number
export type AnimateToFrame = (frame: Frame, withDelay?: boolean) => void

export function useAnimateToFrame({
  from,
  to,
  options,
  onEnd,
}: Props): {
  animateToFrame: AnimateToFrame
  ref: React.MutableRefObject<Element | null>
} {
  const ref = useRef<HTMLElement>(null)
  const animationStartRef = useRef<number>(0)
  const currentAnimationToApproxVelocityRef = useRef<toApproxFn | null>(null)
  const currentAnimationNameRef = useRef<string | null>(null)

  const fromRef = useRef<Frame>(from)

  function handleAnimationEnd({ animationName }: { animationName: string }) {
    if (animationName !== currentAnimationNameRef.current) return
    animationStartRef.current = 0
    onEnd && onEnd()
  }

  useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener('animationend', handleAnimationEnd)

    return () => {
      if (!ref.current) return
      animationStartRef.current = 0
      ref.current.removeEventListener('animationend', handleAnimationEnd)
    }
  }, [])

  function animateToFrame(frame: Frame, withDelay?: boolean) {
    const diff = performance.now() - animationStartRef.current

    if (!ref.current) return

    let velocity = 0

    if (
      animationStartRef.current > 0 &&
      currentAnimationToApproxVelocityRef.current
    ) {
      velocity = currentAnimationToApproxVelocityRef.current(diff)
    }

    const { animation, animationName, toApproxVelocity } = animatedClass({
      from: animationStartRef.current ? computedFrom(to, ref) : fromRef.current,
      to: frame,
      withDelay,
      options: { ...options, velocity },
    })

    currentAnimationToApproxVelocityRef.current = toApproxVelocity

    ref.current.style.animation = animation
    animationStartRef.current = performance.now()

    currentAnimationNameRef.current = animationName
    fromRef.current = frame
  }

  return { ref, animateToFrame }
}
