import * as React from "react"
import { Interaction } from "../utils/types"
import { Animate, ResolveValues } from "./useSpringKeyframes"
import { Options } from "@spring-keyframes/driver"
import { Transforms } from "@spring-keyframes/matrix"

export type Layout = {
  left: number
  top: number
  bottom: number
  right: number
  height: number
  width: number
}

function rect(ref: React.RefObject<HTMLElement>) {
  if (!ref.current) return { top: 0, left: 0, right: 0, bottom: 0 }

  const { top, left, right, bottom } = ref.current.getBoundingClientRect()
  return { top, left, right, bottom }
}

const identity: Partial<Transforms> = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  scale: 1,
}

export const useLayoutTransition = (
  animate: Animate,
  resolveValues: ResolveValues,
  ref: React.RefObject<HTMLElement>,
  transition?: Options
) => {
  const lastRect = React.useRef<Layout | null>(null)

  React.useLayoutEffect(() => {
    if (!ref.current) return

    const { top, left, right, bottom } = rect(ref)
    const { from: current } = resolveValues(undefined, identity)
    const { scale = 1 } = current as Required<Transforms>
    const { x = 0, y = 0, scaleX = scale, scaleY = scale } = current as Required<Transforms>

    const newRect: Layout = {
      top: top - y + window.scrollY,
      bottom: bottom - y + window.scrollY,
      left: left - x + window.scrollX,
      right: right - x + window.scrollX,
      height: (bottom - top) / scaleY,
      width: (right - left) / scaleX,
    }

    if (lastRect.current === null) {
      lastRect.current = { ...newRect }

      return
    }

    const oldRect = lastRect.current

    const hasRectChanged =
      newRect.top !== oldRect.top ||
      newRect.left !== oldRect.left ||
      newRect.height !== oldRect.height ||
      newRect.width !== oldRect.width

    if (!hasRectChanged) return

    lastRect.current = { ...newRect }

    const flippedFrom = {
      x: (oldRect.right - newRect.right + oldRect.left - newRect.left) / 2 + x,
      y: (oldRect.bottom - newRect.bottom + oldRect.top - newRect.top) / 2 + y,
      scaleX: (oldRect.width * scaleX) / newRect.width,
      scaleY: (oldRect.height * scaleY) / newRect.height,
    }

    animate(
      {
        x: identity.x,
        y: identity.y,
        scaleX: identity.scaleX,
        scaleY: identity.scaleY,
      },
      Interaction.Layout,
      flippedFrom,
      undefined,
      transition
    )
  })
}
