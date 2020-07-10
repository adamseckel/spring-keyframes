import { useRef, useEffect, useContext } from 'react'
import {
  driver,
  Frame,
  Options,
  Property,
  tweenedProperties,
} from '@spring-keyframes/driver'
import { KeyframesContext } from '../components/Keyframes'
import hash from '@emotion/hash'
import { computedFrom } from '../utils/computedFrom'

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
  name,
}: {
  from: Frame
  to: FrameWithTransition
  withDelay?: boolean
  options?: Transition
  keyframes: (name: string, rule: string) => string
  name: string
}): {
  animation: string
  animationNames: string[]
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

  const tweened =
    type === 'ease' ? (Object.keys(to) as Property[]) : tweenedProps

  const fill = name === 'layout' ? 'none' : fillMode

  const [frames, springDuration, ease, toApproxVelocity] = driver(from, to, {
    stiffness,
    damping,
    mass,
    precision,
    withInvertedScale,
    withEveryFrame,
    tweenedProps: tweened,
  })

  console.log(frames)
  const preHash = JSON.stringify({
    to,
    from,
    options: {
      ...options,
      tweenedProps: tweened,
    },
  })

  const animations = frames.map((animation, i) => {
    const n = name + '-' + hash(preHash) + '-' + i
    keyframes(n, animation)
    return n
  })

  // @TODO: Optionally use window.matchMedia to use tweened animations only if "prefers-reduced-motion" is "reduce".
  const animationDuration = duration ? duration + 'ms' : springDuration
  const animationDelay = delay && withDelay ? `${delay}ms` : '0ms'

  const timing = toTimingFunction(
    type === 'ease',
    withEveryFrame || withInvertedScale,
    ease,
    timingFunction
  )

  const toAnimationString = (a: string, i: number) =>
    `${a} ${timing(i)} ${animationDuration} ${animationDelay} 1 ${fill} `

  return {
    animation: animations.map(toAnimationString).join(', '),
    animationNames: animations,
    toApproxVelocity,
  }
}

interface Props {
  from: Frame
  to: FrameWithTransition
  options: Transition
  onEnd?: () => void
}

type toApproxFn = (v: number) => number

interface AnimateToProps {
  frame: FrameWithTransition
  withDelay?: boolean
  name?: string
  absoluteFrom?: Frame
}

export type FrameWithTransition = Frame & { transition?: Transition }
export type AnimateToFrame = (props: AnimateToProps) => void

export function useAnimateToFrame({
  from,
  to,
  options,
  onEnd,
}: Props): {
  animateToFrame: AnimateToFrame
  ref: React.MutableRefObject<HTMLElement | null>
} {
  const ref = useRef<HTMLElement>(null)
  const animationStartRef = useRef<number>(0)
  const currentAnimationToApproxVelocityRef = useRef<toApproxFn | null>(null)
  const currentAnimationNameRef = useRef<string | null>(null)
  const { keyframes, flush } = useContext(KeyframesContext)
  const namesRef = useRef<Set<string>>(new Set([]))
  const fromRef = useRef<Frame>(from)

  function handleAnimationEnd({ animationName }: { animationName: string }) {
    if (animationName !== currentAnimationNameRef.current) return
    if (animationName.includes('layout')) {
      if (!ref.current) return

      ref.current.style.animation = ''
    }
    animationStartRef.current = 0
    onEnd && onEnd()
  }

  useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener('animationend', handleAnimationEnd)

    return () => {
      if (!ref.current) return
      ref.current.removeEventListener('animationend', handleAnimationEnd)

      flush(Array.from(namesRef.current))
    }
  }, [])

  function toFrame(props: {
    diff: number
    frame: FrameWithTransition
    name: string
    withDelay?: boolean
    absoluteFrom?: Frame
  }) {
    if (!ref.current) return
    const { diff, withDelay, name, absoluteFrom } = props
    let { frame } = props
    const frameTransition = { ...frame.transition }
    delete frame.transition
    let velocity = 0

    if (
      animationStartRef.current > 0 &&
      currentAnimationToApproxVelocityRef.current
    ) {
      velocity = currentAnimationToApproxVelocityRef.current(diff)
    }
    let from = animationStartRef.current
      ? computedFrom(to, ref)
      : fromRef.current

    if (absoluteFrom) {
      from = { ...from, ...absoluteFrom }
      frame = { ...fromRef.current, ...frame }
    }

    const { animation, animationNames, toApproxVelocity } = animatedClass({
      from,
      to: frame,
      withDelay,
      options: {
        ...options,
        ...frameTransition,
        velocity,
        withInvertedScale: false,
        withEveryFrame: options.withInvertedScale,
      },
      keyframes,
      name,
    })

    animationNames.forEach(n => namesRef.current.add(n))

    if (options.withInvertedScale) {
      if (
        ref.current.childNodes[0] &&
        ref.current.childNodes[0].nodeType !== 3
      ) {
        const { animation, animationNames } = animatedClass({
          from,
          to: frame,
          withDelay,
          options: {
            ...options,
            ...frameTransition,
            velocity,
            withInvertedScale: true,
          },
          keyframes,
          name: `${name}-inverted`,
        })
        ;(ref.current.childNodes[0] as HTMLElement).style.animation = animation

        animationNames.forEach(name => namesRef.current.add(name))
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

    if (performance) {
      animationStartRef.current = performance.now()
    }

    currentAnimationNameRef.current = animationNames[0]

    fromRef.current = frame
  }

  function animateToFrame({
    frame,
    withDelay,
    name = 'animate',
    absoluteFrom,
  }: AnimateToProps) {
    if (typeof window === 'undefined') {
      toFrame({ diff: 0, frame, withDelay, name })
      return
    }

    function toFrameWithOffset(offset: number) {
      return toFrame({
        diff: offset - animationStartRef.current,
        frame,
        withDelay,
        name,
        absoluteFrom,
      })
    }

    requestAnimationFrame(toFrameWithOffset)
  }

  return { ref, animateToFrame }
}
