import * as React from "react"
import { Frame, Options } from "@spring-keyframes/driver"
import { Interaction } from "../utils/types"
import { UseDriver } from "./useDriver"

export interface Props {
  whilePress?: Frame
  whileHover?: Frame
}

export function useWhileInteraction(
  driver: UseDriver,
  ref: React.RefObject<HTMLElement>,
  { whilePress, whileHover }: Props,
  transition?: Options
): void {
  const cache = React.useRef({
    isTouchDevice: false,
  })

  function handleTap() {
    if (!whilePress) return
    driver.animate(whilePress, Interaction.Press, undefined, undefined, transition)
  }

  function handleTapEnd() {
    if (!whilePress) return

    driver.animate(undefined, Interaction.None, undefined, undefined, transition)
  }

  function handleMouseEnter() {
    if (!whileHover) return
    driver.animate(whileHover, Interaction.Hover, undefined, undefined, transition)
  }

  function handleMouseEnterEnd() {
    if (!whileHover) return
    driver.animate(undefined, Interaction.None, undefined, undefined, transition)
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
