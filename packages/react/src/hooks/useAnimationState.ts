import { useCallback, useRef } from 'react'
import { Frame } from '@spring-keyframes/driver'
import { Transition } from './useAnimate'

export function useAnimationState(
  to: Frame,
  transition?: Transition
): [AnimationState, (state: Partial<State>) => void] {
  const state = useRef<State>({
    distortion: to,
    preserve: false,
    options: transition,
    isInverted: false,
  })

  const updateState = useCallback((newState: Partial<State>) => {
    state.current = {
      ...state.current,
      ...newState,
    }
  }, [])

  return [state, updateState]
}

export interface State {
  distortion: Frame
  preserve: boolean
  isInverted: boolean
  options?: Transition
}

export type AnimationState = React.MutableRefObject<State>
