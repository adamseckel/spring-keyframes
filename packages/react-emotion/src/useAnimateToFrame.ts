import { useRef, useEffect } from 'react'
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
  /** Run a "spring" animation with some eased props, or use an "ease" timing function for all props. */
  type?: 'spring' | 'ease'
  /** Specify a timing function to use with "type: 'ease'". */
  timingFunction?: React.CSSProperties['animationTimingFunction']
  /** Specify an "animationFillMode" to be applied to animations.
   * By default, spring-keyframes applies the "initial" frame values to the element.
   * This prevents flashes of content before the animation is added,
   * so only "none", "both", and "backwards" have an effect. */
  fillMode?: React.CSSProperties['animationFillMode']
}

type TransformProperty =
  | 'translateX'
  | 'translateY'
  | 'translateZ'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'

const defaults: Transition = {
  stiffness: 380,
  damping: 20,
  mass: 1,
  precision: 0.01,
  velocity: 0,
  tweenedProps: tweenedProperties,
  type: 'spring',
  timingFunction: 'cubic-bezier(0.15, 0, 0, 1)',
  fillMode: 'both',
  withEveryFrame: false,
  withInvertedScale: false,
}

const toTimingFunction = (
  isEase: boolean,
  isLinear: boolean,
  ease: string,
  userTimingFunction: string
) => (i: number) => {
  if (isEase) return userTimingFunction
  if (i === 0 && isLinear) return 'linear'
  if (i === 0 && !isLinear) return ease

  return userTimingFunction
}

function animatedClass({
  from,
  to,
  withDelay,
  options = {},
  keyframes,
}: {
  from: Frame
  to: Frame
  withDelay?: boolean
  options?: Transition
  keyframes: (...args: any) => any
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
    timingFunction,
    fillMode,
    withInvertedScale,
    withEveryFrame,
  } = {
    ...defaults,
    ...options,
  } as Required<Transition>

  const [frames, springDuration, ease, toApproxVelocity] = spring(from, to, {
    stiffness,
    damping,
    mass,
    precision,
    withInvertedScale,
    withEveryFrame,
    tweenedProps:
      type === 'ease' ? (Object.keys(from) as Property[]) : tweenedProps,
  })

  // @TODO: Optionally use window.matchMedia to use tweened animations only if "prefers-reduced-motion" is "reduce".
  const animations = frames.map(animation => keyframes`${animation}`)

  const animationDuration = duration ? duration + 'ms' : springDuration
  const animationDelay = delay && withDelay ? `${delay}ms` : '0ms'
  const animationName = type === 'ease' ? animations[1] : animations[0]
  const timing = toTimingFunction(
    type === 'ease',
    withEveryFrame || withInvertedScale,
    ease,
    timingFunction
  )

  const toAnimationString = (a: string, i: number) =>
    `${a} ${timing(i)} ${animationDuration} ${animationDelay} 1 ${fillMode}`

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
      // @ts-ignore
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
  keyframes: (...args: any) => string
}

type toApproxFn = (v: number) => number
export type AnimateToFrame = (frame: Frame, withDelay?: boolean) => void

export function useAnimateToFrame({
  from,
  to,
  options,
  onEnd,
  keyframes,
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

  function toFrame(diff: number, frame: Frame, withDelay?: boolean) {
    if (!ref.current) return

    let velocity = 0

    if (
      animationStartRef.current > 0 &&
      currentAnimationToApproxVelocityRef.current
    ) {
      velocity = currentAnimationToApproxVelocityRef.current(diff)
    }

    const from = animationStartRef.current
      ? computedFrom(to, ref)
      : fromRef.current

    const { animation, animationName, toApproxVelocity } = animatedClass({
      from,
      to: frame,
      withDelay,
      options: {
        ...options,
        velocity,
        withInvertedScale: false,
        withEveryFrame: options.withInvertedScale,
      },
      keyframes,
    })

    if (options.withInvertedScale) {
      if (
        ref.current.childNodes[0] &&
        ref.current.childNodes[0].nodeType !== 3
      ) {
        const { animation } = animatedClass({
          from,
          to: frame,
          withDelay,
          options: { ...options, velocity, withInvertedScale: true },
          keyframes,
        })
        ;(ref.current.childNodes[0] as HTMLElement).style.animation = animation
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `@spring-keyframes: withInvertedScale requires a child DOM node to invert the scale onto.`
          )
        }
      }
    }

    currentAnimationToApproxVelocityRef.current = toApproxVelocity

    ref.current.style.animation = animation
    animationStartRef.current = performance.now()
    currentAnimationNameRef.current = animationName

    fromRef.current = frame
  }

  function animateToFrame(frame: Frame, withDelay?: boolean) {
    requestAnimationFrame(now =>
      toFrame(now - animationStartRef.current, frame, withDelay)
    )
  }

  return { ref, animateToFrame }
}
