import { useAnimateToFrame, Transition } from './useAnimateToFrame'
import { useWhileInteraction } from './useWhileInteraction'
import { useRef, useContext, useEffect } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { Frame } from '@spring-keyframes/driver'
import { SpringContext } from './AnimateExit'

const defaults = {
  stiffness: 380,
  damping: 20,
  mass: 1,
  precision: 0.01,
  velocity: 0,
}

interface Props {
  /** A @Frame to animate to when the Animated component mounts. */
  animate: Frame
  /** A @Frame to animate from when the Animated component mounts. */
  initial: Frame
  /** Define options for all of the Animated components transitions, including the spring, and delay. */
  transition?: Transition
  /** A @Frame to animated to when @show is toggled to false. */
  exit?: Frame
  /** A @Frame to animate from while the Animated component is tapped. */
  whileTap?: Frame
  /** A @Frame to animate from while the Animated component is hovered. */
  whileHover?: Frame
}

export function useSpring({
  animate: to,
  initial: from,
  transition: options,
  exit,
  whileTap,
  whileHover,
}: Props) {
  const mountRef = useRef(false)
  const context = useContext(SpringContext)
  const exitRef = useRef(context)
  const { isExiting, onExitComplete } = context || {}
  const isVisible = !isExiting
  const visibilityRef = useRef(isVisible)

  useEffect(() => {
    exitRef.current = { isExiting, onExitComplete }
  }, [isExiting, onExitComplete])

  const onEnd = () => {
    if (exitRef.current && exitRef.current.isExiting && exit) {
      if (!exitRef.current.onExitComplete) return
      exitRef.current.onExitComplete()
    }
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

  if (whileTap || whileHover) {
    useWhileInteraction({
      ref,
      animateToFrame,
      from: to,
      whileHover,
      whileTap,
    })
  }

  useEffect(() => {}, [])

  // Deep compare the `animate|to` @Frame so that we can animate updates.
  useDeepCompareEffect(() => {
    if (!mountRef.current) {
      animateToFrame(to, true)
      mountRef.current = true
      return
    }

    if (!isVisible && exit) {
      animateToFrame(exit, true)
    } else {
      animateToFrame(to, true)
    }

    visibilityRef.current = isVisible
  }, [isVisible, to])

  return {
    ref,
  }
}
