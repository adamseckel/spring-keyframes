import { useCallback, useRef } from 'react'
import { Frame } from '@spring-keyframes/driver'
import { Transition } from './useAnimate'

export function useAnimationState(to: Frame, transition?: Transition): Use {
  const cache = useRef({
    distortion: to,
    preserve: false,
    options: transition,
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

  return {
    state: cache,
    updateDistortion,
    updatePreserve,
    updateOptions,
  }
}

interface Use {
  state: AnimationState
  updateDistortion: (frame: Frame) => void
  updatePreserve: (preserve: boolean) => void
  updateOptions: (options: Transition) => void
}

export interface State {
  distortion: Frame
  preserve: boolean
  options?: Transition
}

export type AnimationState = React.MutableRefObject<State>
