import { useAnimateToFrame } from './useAnimateToFrame'
import { useWhileInteraction } from './useWhileInteraction'
import { useRef, useContext, useEffect } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { Frame, Options } from '@spring-keyframes/driver'
import { SpringContext } from './AnimateExit'

const defaults = {
  stiffness: 380,
  damping: 20,
  mass: 1,
  precision: 0.01,
  velocity: 0,
}
interface Transition extends Options {
  delay?: number
}

interface Props {
  visible?: boolean
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
  const visibilityRef = useRef(false)
  const context = useContext(SpringContext)
  const exitRef = useRef(context)
  const { isExiting, onExitComplete } = context || {}
  const isVisible = !isExiting

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

  // Deep compare the `animate|to` @Frame so that we can animate updates.
  useDeepCompareEffect(() => {
    if (isVisible && isVisible !== visibilityRef.current) {
      animateToFrame(to)
    } else if (!isVisible && isVisible !== visibilityRef.current && exit) {
      animateToFrame(exit)
    } else if (isVisible) {
      animateToFrame(to, true)
    }

    visibilityRef.current = isVisible
  }, [isVisible, to])

  return {
    ref,
  }
}
