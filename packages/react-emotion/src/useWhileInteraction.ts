import { useRef } from 'react'
import { AnimateToFrame } from './useAnimated'
import { Frame } from '@spring-keyframes/driver'
import { Handler } from './Animated'

interface Props {
  ref: React.MutableRefObject<Element | null>
  animateToFrame: AnimateToFrame
  from: Frame
  whileTap?: Frame
  whileHover?: Frame
}

export function useWhileInteraction({
  ref,
  animateToFrame,
  from,
  whileTap,
  whileHover,
}: Props): Handler {
  const isHoveredRef = useRef(false)

  function handleTap() {
    if (!whileTap) return
    animateToFrame(whileTap)
  }

  function handleTapEnd() {
    if (whileHover) {
      animateToFrame(isHoveredRef.current ? whileHover : from)
      return
    }
    animateToFrame(from)
  }

  function handleMouseEnter() {
    if (!whileHover) return
    isHoveredRef.current = true
    animateToFrame(whileHover)
  }

  function handleMouseEnterEnd() {
    isHoveredRef.current = false
    animateToFrame(from)
  }

  function _mount() {
    if (!ref.current) return
    if (whileHover) {
      ref.current.addEventListener('mouseenter', handleMouseEnter)
      ref.current.addEventListener('mouseleave', handleMouseEnterEnd)
    }
    if (whileTap) {
      ref.current.addEventListener('mousedown', handleTap)
      ref.current.addEventListener('mouseup', handleTapEnd)
      ref.current.addEventListener('touchstart', handleTap)
      ref.current.addEventListener('touchend', handleTapEnd)
    }
  }

  function _unMount() {
    if (!ref.current) return
    if (whileHover) {
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

  return {
    _mount,
    _unMount,
  }
}
