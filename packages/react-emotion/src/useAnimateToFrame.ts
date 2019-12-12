import { useRef, useEffect } from 'react'
import { keyframes } from 'emotion'
import {
  default as spring,
  Frame,
  Options,
  Property,
} from '@spring-keyframes/driver'
import Unmatrix from './unmatrix'

const unmatrix = new Unmatrix()

interface Transition extends Options {
  delay?: number
}

type TransformProperty =
  | 'scaleX'
  | 'perspective'
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
  const { stiffness, damping, mass, precision, delay } = {
    ...defaults,
    ...options,
  }

  const [frames, duration, ease, toApproxVelocity] = spring(from, to, {
    stiffness,
    damping,
    mass,
    precision,
  })
  const animations = frames.map(animation => keyframes`${animation}`)

  return {
    animation: animations
      .map(
        (animation, i) =>
          `${animation} ${
            i === 1 ? 'cubic-bezier(0.42, 0.01, 0, 1)' : ease
          } ${duration} ${delay ? `${withDelay ? delay : 0}ms` : ''} 1 both`
      )
      .join(', '),
    animationName: animations[0],
    toApproxVelocity,
  }
}

function computedFrom(to: Frame, ref: React.MutableRefObject<Element | null>) {
  if (!ref.current) return {} as Frame

  // @TODO: Optionally infer unset from from element style.
  const frame: Frame = {}
  const style = getComputedStyle(ref.current)
  const frameTransforms: Partial<Record<TransformProperty, any>> =
    unmatrix.getTransform(ref.current) || {}
  const keys = Object.keys(to) as Property[]

  keys.forEach(key => {
    //@ts-ignore
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
