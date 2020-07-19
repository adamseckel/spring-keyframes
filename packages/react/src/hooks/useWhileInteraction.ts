import { useRef, useEffect } from 'react'
import { Play } from './useAnimate'
import { Frame } from '@spring-keyframes/driver'
import { Interaction } from '../utils/types'

interface Props {
  ref: React.MutableRefObject<Element | null>
  play: Play
  from: Frame

  whileTap?: Frame
  whileHover?: Frame

  updateDistortion: (distortion: Frame) => void
  updatePreserve: (preserve: boolean) => void
}

export function useWhileInteraction({
  ref,
  play,
  from,
  whileTap,
  whileHover,
  updateDistortion,
  updatePreserve,
}: Props): { isBeingInteracted: boolean } {
  const cache = useRef({
    isHovered: false,
    isTapped: false,
    isTouchDevice: false,
  })

  function handleTap() {
    if (!whileTap) return

    cache.current.isTapped = true

    updatePreserve(true)
    updateDistortion(whileTap)
    play({ to: whileTap, interaction: Interaction.Tap })
  }

  function handleTapEnd() {
    if (!whileTap) return

    updatePreserve(false)

    if (whileHover) {
      const to = cache.current.isHovered ? whileHover : from
      updateDistortion(to)
      play({ to, interaction: Interaction.Tap })
    } else {
      updateDistortion(from)
      play({ to: from, interaction: Interaction.Tap })
    }
  }

  function handleMouseEnter() {
    if (!whileHover) return

    cache.current.isHovered = true
    updatePreserve(true)
    updateDistortion(whileHover)
    play({ to: whileHover, interaction: Interaction.Hover })
  }

  function handleMouseEnterEnd() {
    if (!whileHover) return

    cache.current.isHovered = false
    updatePreserve(false)
    updateDistortion(from)
    play({ to: from, interaction: Interaction.Hover })
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
