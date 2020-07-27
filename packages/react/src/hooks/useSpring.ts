import { useRef, useContext, useEffect, useCallback } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { Frame, createTransformString } from '@spring-keyframes/driver'
import { useAnimate, Transition } from './useAnimate'
import { useWhileInteraction } from './useWhileInteraction'
import { useLayoutTransition } from './useLayoutTransition'
import { useAnimationState } from './useAnimationState'
import { SpringContext } from '../components/AnimateExit'
import { Interaction } from '../utils/types'

export interface Props {
  /** A @Frame to animate to when the Animated component mounts. */
  animate: Frame
  /** A @Frame to animate from when the Animated component mounts. */
  initial: Frame
  /** A @Frame to animated to when @show is toggled to false. */
  exit?: Frame
  /** A @Frame to animate from while the Animated component is tapped. */
  whileTap?: Frame
  /** A @Frame to animate from while the Animated component is hovered. */
  whileHover?: Frame
  /** Define whether or not the component should animate to a new position when it's relative position in the DOM changes. */
  layout?: boolean | Transition
  /** Define options for all of the Animated components transitions, including the spring, and delay. */
  transition?: Transition
  /** A callback to invoke whenever an animation fully completes. Interrupted animations will not trigger this callback. */
  onEnd?: () => void

  mountRef: React.MutableRefObject<boolean>
}

function updateStyle(ref: React.RefObject<HTMLElement>, frame: Frame) {
  if (!ref.current) return

  const style = {
    ...frame,
    x: undefined,
    y: undefined,
    transform: createTransformString(frame),
  }
  for (const key in style) {
    //@ts-ignore
    ref.current.style[key] = style[key]
  }
}

export function useSpring({
  animate: to,
  initial: from,
  transition,
  exit,
  whileTap,
  whileHover,
  layout,
  onEnd: onAnimationEnd,
  mountRef,
}: Props) {
  const context = useContext(SpringContext)
  const exitRef = useRef(context)
  const {
    state,
    updateOptions,
    updateDistortion,
    updateIsInverted,
    updatePreserve,
  } = useAnimationState(to, transition)

  const { isExiting, onExitComplete } = context || {}
  const callback = useCallback(() => {
    if (exitRef.current && exitRef.current.isExiting && exit) {
      if (!exitRef.current.onExitComplete) return
      exitRef.current.onExitComplete()
    }

    onAnimationEnd && onAnimationEnd()
  }, [exit, onAnimationEnd])

  const { ref, play } = useAnimate({ callback, updateIsInverted, state })

  useEffect(() => {
    exitRef.current = { isExiting, onExitComplete }

    if (isExiting && !exit && onExitComplete) onExitComplete()

    if (exit && isExiting)
      play({
        to: exit,
        withDelay: true,
        interaction: Interaction.Exit,
      })
  }, [isExiting, onExitComplete])

  const { updateLayout } = useLayoutTransition(ref, play, !!layout, state)

  useEffect(() => {
    play({ to, from, withDelay: true, interaction: Interaction.Mount })
    updateStyle(ref, to)
    updateLayout()

    setTimeout(() => (mountRef.current = true), 1)
  }, [])

  useWhileInteraction({
    ref,
    play,
    from: to,
    whileHover,
    whileTap,
    updateDistortion,
    updatePreserve,
    updateStyle,
  })

  useDeepCompareEffectNoCheck(() => {
    if (!mountRef.current || isExiting) return

    updateDistortion(to)
    updateStyle(ref, to)
    play({ to, withDelay: true, interaction: Interaction.Animate })
  }, [to])

  useDeepCompareEffectNoCheck(() => {
    if (transition) updateOptions(transition)
  }, [transition])

  return {
    ref,
  }
}
