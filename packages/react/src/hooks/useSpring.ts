import {
  useAnimateToFrame,
  Transition,
  FrameWithTransition,
} from './useAnimateToFrame'
import { useWhileInteraction } from './useWhileInteraction'
import { useLayoutTransition, Layout } from './useLayoutTransition'
import { useRef, useContext, useEffect } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { Frame, tweenedProperties } from '@spring-keyframes/driver'
import { SpringContext } from '../components/AnimateExit'

const defaults = {
  stiffness: 380,
  damping: 20,
  mass: 1,
  precision: 0.01,
  velocity: 0,
  tweenedProps: tweenedProperties,
}

export interface Props {
  /** A @Frame to animate to when the Animated component mounts. */
  animate: FrameWithTransition
  /** A @Frame to animate from when the Animated component mounts. */
  initial: Frame
  /** A @Frame to animated to when @show is toggled to false. */
  exit?: FrameWithTransition
  /** A @Frame to animate from while the Animated component is tapped. */
  whileTap?: FrameWithTransition
  /** A @Frame to animate from while the Animated component is hovered. */
  whileHover?: FrameWithTransition
  /** Define whether or not the component should animate to a new position when it's relative position in the DOM changes. */
  withPositionTransition?: boolean | Transition
  /** Define whether or not the component should animate to a new size when it's relative size in the DOM changes. */
  withSizeTransition?: boolean | Transition
  /** Define options for all of the Animated components transitions, including the spring, and delay. */
  transition?: Transition
  /** A callback to invoke whenever an animation fully completes. Interrupted animations will not trigger this callback. */
  onEnd?: () => void
}

function ensureFrames(to: Frame, from: Frame) {
  if (process.env.NODE_ENV !== 'production') {
    const toKeys = Object.keys(to)
    const fromKeys = Object.keys(from)

    if (fromKeys.length === toKeys.length) return
    if (fromKeys.every(key => toKeys.includes(key))) return

    console.warn(
      '@spring-keyframes: Frames "initial" and "animate" must have identical property keys, and can\'t be null or undefined.'
    )
  }
}

export function useSpring({
  animate: to,
  initial: from,
  transition: options,
  exit,
  whileTap,
  whileHover,
  withPositionTransition,
  withSizeTransition,
  onEnd: onAnimationEnd,
}: Props) {
  const mountRef = useRef(false)
  const context = useContext(SpringContext)
  const exitRef = useRef(context)
  const { isExiting, onExitComplete } = context || {}
  const layout = useRef<Layout | null>(null)

  ensureFrames(to, from)

  const onEnd = () => {
    if (exitRef.current && exitRef.current.isExiting && exit) {
      if (!exitRef.current.onExitComplete) return
      exitRef.current.onExitComplete()
    }

    onAnimationEnd && onAnimationEnd()
  }

  const { ref, animateToFrame } = useAnimateToFrame({
    from,
    to,
    onEnd,
    options: {
      ...defaults,
      ...options,
    },
  })

  useEffect(() => {
    exitRef.current = { isExiting, onExitComplete }
    if (isExiting && !exit && process.env.NODE_ENV !== 'production')  {
      console.warn(
        '@spring-keyframes: Children of AnimateExit must declare an "exit" Frame.'
      )
    }
    
    if (exit && isExiting) {
      animateToFrame({ frame: exit, withDelay: true, name: 'exit' })
    }

  }, [isExiting, onExitComplete])

  useEffect(() => {
    animateToFrame({ frame: to, withDelay: true, name: 'mount' })
    setTimeout(() => (mountRef.current = true), 1)
  }, [])

  if (whileTap || whileHover) {
    useWhileInteraction({
      ref,
      animateToFrame,
      from: to,
      whileHover,
      whileTap,
    })
  }

  if (withPositionTransition || withSizeTransition) {
    useLayoutTransition({
      ref,
      animateToFrame,
      layout,
      withPositionTransition,
      withSizeTransition,
    })
  }

  // Deep compare the `animate|to` @Frame so that we can animate updates.
  useDeepCompareEffectNoCheck(() => {
    if (!mountRef.current) return

    ensureFrames(to, from)

    if (isExiting) return

    animateToFrame({ frame: to, withDelay: true, name: 'to' })

  }, [to])

  return {
    ref,
  }
}
