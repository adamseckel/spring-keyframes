import { useRef, useEffect } from 'react'
import { Play } from './useAnimate'
import { Frame } from '@spring-keyframes/driver'
import { Interaction } from '../utils/types'
import { State } from './useAnimationState'

interface Props {
  ref: React.RefObject<HTMLElement>
  play: Play
  from: Frame

  whileTap?: Frame
  whileHover?: Frame

  updateStyle: (ref: React.RefObject<HTMLElement>, frame: Frame) => void
  setState: (state: Partial<State>) => void
}

export function useWhileInteraction({
  ref,
  play,
  from,
  whileTap,
  whileHover,
  updateStyle,
  setState,
}: Props): { isBeingInteracted: boolean } {
  const cache = useRef({
    isHovered: false,
    isTapped: false,
    isTouchDevice: false,
  })

  function handleTap() {
    if (!whileTap) return

    cache.current.isTapped = true

    setState({
      distortion: whileTap,
      preserve: true,
    })

    play({ to: whileTap, interaction: Interaction.Tap })
    updateStyle(ref, whileTap)
  }

  function handleTapEnd() {
    if (!whileTap) return
    let distortion

    if (whileHover) {
      const to = cache.current.isHovered ? whileHover : from
      distortion = to
      play({ to, interaction: Interaction.TapEndHover })
      updateStyle(ref, to)
    } else {
      distortion = from
      play({ to: from, interaction: Interaction.TapEnd })
      updateStyle(ref, from)
    }

    setState({
      preserve: false,
      distortion,
    })
  }

  function handleMouseEnter() {
    if (!whileHover) return

    cache.current.isHovered = true
    setState({
      preserve: true,
      distortion: whileHover,
    })
    play({ to: whileHover, interaction: Interaction.Hover })
    updateStyle(ref, whileHover)
  }

  function handleMouseEnterEnd() {
    if (!whileHover) return

    cache.current.isHovered = false
    setState({
      preserve: false,
      distortion: from,
    })
    play({ to: from, interaction: Interaction.HoverEnd })
    updateStyle(ref, from)
  }

  useEffect(() => {
    if (!ref.current) return
    cache.current.isTouchDevice =
      typeof window !== 'undefined' && 'ontouchstart' in window

    if (whileHover && !cache.current.isTouchDevice) {
      ref.current.addEventListener('mouseenter', handleMouseEnter)
      ref.current.addEventListener('mouseleave', handleMouseEnterEnd)
    }
    if (whileTap) {
      if (!cache.current.isTouchDevice) {
        ref.current.addEventListener('mousedown', handleTap)
        ref.current.addEventListener('mouseup', handleTapEnd)
      }
      ref.current.addEventListener('touchstart', handleTap)
      ref.current.addEventListener('touchend', handleTapEnd)
    }

    return () => {
      if (!ref.current) return
      if (whileHover && !cache.current.isTouchDevice) {
        ref.current.addEventListener('mouseenter', handleMouseEnter)
        ref.current.addEventListener('mouseleave', handleMouseEnterEnd)
      }
      if (whileTap) {
        ref.current.removeEventListener('mousedown', handleTap)
        ref.current.removeEventListener('mouseup', handleTapEnd)
        ref.current.removeEventListener('touchstart', handleTap)
        ref.current.removeEventListener('touchend', handleTapEnd)
      }
    }
  }, [])

  return {
    isBeingInteracted: cache.current.isTapped || cache.current.isHovered,
  }
}
