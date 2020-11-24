import * as React from "react"
import { Frame } from "@spring-keyframes/driver"
import { Interaction } from "../utils/types"
import { Animate } from "./useSpringKeyframes"

interface Props {
  whilePress: Frame | undefined
  whileHover: Frame | undefined
}

export function useWhileInteraction(
  animate: Animate,
  ref: React.RefObject<HTMLElement>,
  { whilePress, whileHover }: Props
): void {
  const cache = React.useRef({
    isHovered: false,
    isTapped: false,
    isTouchDevice: false,
  })

  function handleTap() {
    if (!whilePress) return

    cache.current.isTapped = true

    animate(whilePress, Interaction.Tap)
  }

  function handleTapEnd() {
    if (!whilePress) return

    if (whileHover) {
      const to = cache.current.isHovered ? whileHover : undefined
      animate(to, Interaction.TapEndHover)
    } else {
      animate(undefined, Interaction.TapEnd)
    }
  }

  function handleMouseEnter() {
    if (!whileHover) return

    cache.current.isHovered = true
    animate(whileHover, Interaction.Hover)
  }

  function handleMouseEnterEnd() {
    if (!whileHover) return

    cache.current.isHovered = false
    animate(undefined, Interaction.HoverEnd)
  }

  React.useEffect(() => {
    if (!ref.current) return
    cache.current.isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window

    if (whileHover && !cache.current.isTouchDevice) {
      ref.current.addEventListener("mouseenter", handleMouseEnter)
      ref.current.addEventListener("mouseleave", handleMouseEnterEnd)
    }
    if (whilePress) {
      if (!cache.current.isTouchDevice) {
        ref.current.addEventListener("mousedown", handleTap)
        ref.current.addEventListener("mouseup", handleTapEnd)
      }
      ref.current.addEventListener("touchstart", handleTap)
      ref.current.addEventListener("touchend", handleTapEnd)
    }

    return () => {
      if (!ref.current) return
      if (whileHover && !cache.current.isTouchDevice) {
        ref.current.addEventListener("mouseenter", handleMouseEnter)
        ref.current.addEventListener("mouseleave", handleMouseEnterEnd)
      }
      if (whilePress) {
        ref.current.removeEventListener("mousedown", handleTap)
        ref.current.removeEventListener("mouseup", handleTapEnd)
        ref.current.removeEventListener("touchstart", handleTap)
        ref.current.removeEventListener("touchend", handleTapEnd)
      }
    }
  }, [])
}
