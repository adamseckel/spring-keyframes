import { useCallback, useRef } from 'react'
import { Frame } from '@spring-keyframes/driver'
import { Transition } from './useAnimate'

export function useAnimationState(to: Frame, transition?: Transition): Use {
  const cache = useRef<State>({
    distortion: to,
    preserve: false,
    options: transition,
    isInverted: false,
  })

  const updateDistortion = useCallback((frame: Frame) => {
    cache.current.distortion = frame
  }, [])

  const updatePreserve = useCallback((preserve: boolean) => {
    cache.current.preserve = preserve
  }, [])

  const updateOptions = useCallback((options: Transition) => {
    cache.current.options = options
  }, [])

  const updateIsInverted = useCallback((inverted: boolean) => {
    cache.current.isInverted = inverted
  }, [])

  return {
    state: cache,
    updateDistortion,
    updatePreserve,
    updateOptions,
    updateIsInverted,
  }
}

interface Use {
  state: AnimationState
  updateDistortion: (frame: Frame) => void
  updatePreserve: (preserve: boolean) => void
  updateOptions: (options: Transition) => void
  updateIsInverted: (inverted: boolean) => void
}

export interface State {
  distortion: Frame
  preserve: boolean
  isInverted: boolean
  options?: Transition
}

export type AnimationState = React.MutableRefObject<State>
