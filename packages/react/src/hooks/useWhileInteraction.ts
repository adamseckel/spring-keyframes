import type { Driver } from "../Driver"
import type * as React from "react"
import type { Frame, Options } from "@spring-keyframes/driver"

import { Interaction } from "../utils/Interaction"
import { useEffect } from "react"

export interface Props {
  whilePress?: Frame
  whileHover?: Frame
}

export function useWhileInteraction(
  driver: Driver,
  ref: React.RefObject<HTMLElement>,
  { whilePress, whileHover }: Props,
  options?: Options
): void {
  function handleTap() {
    if (whilePress) driver.animate({ interaction: Interaction.Press, to: whilePress, options })
  }

  function handleTapEnd() {
    if (whilePress) driver.animate({ interaction: Interaction.None, options })
  }

  function handleMouseEnter() {
    if (whileHover) driver.animate({ interaction: Interaction.Hover, to: whileHover, options })
  }

  function handleMouseEnterEnd() {
    if (whileHover) driver.animate({ interaction: Interaction.None, options })
  }

  useEffect(() => {
    if (!ref.current) return
    const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window

    if (whileHover && !isTouchDevice) {
      ref.current.addEventListener("mouseenter", handleMouseEnter)
      ref.current.addEventListener("mouseleave", handleMouseEnterEnd)
    }

    if (whilePress) {
      if (!isTouchDevice) {
        ref.current.addEventListener("mousedown", handleTap)
        ref.current.addEventListener("mouseup", handleTapEnd)
      }
      ref.current.addEventListener("touchstart", handleTap)
      ref.current.addEventListener("touchend", handleTapEnd)
      document.addEventListener("mouseleave", handleTapEnd)
    }

    return () => {
      if (!ref.current) return
      if (whileHover && !isTouchDevice) {
        ref.current.addEventListener("mouseenter", handleMouseEnter)
        ref.current.addEventListener("mouseleave", handleMouseEnterEnd)
      }
      if (whilePress) {
        ref.current.removeEventListener("mousedown", handleTap)
        ref.current.removeEventListener("mouseup", handleTapEnd)
        ref.current.removeEventListener("touchstart", handleTap)
        ref.current.removeEventListener("touchend", handleTapEnd)
        document.removeEventListener("mouseleave", handleTapEnd)
      }
    }
  }, [])
}
