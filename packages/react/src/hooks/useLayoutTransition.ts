import * as React from "react"
import { Interaction } from "../utils/types"
import { UseDriver } from "./useDriver"
import { Frame, Options } from "@spring-keyframes/driver"
import { Transforms } from "@spring-keyframes/matrix"
import { createComputedFrame } from "./useDriver/createFrame"

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
type Identity = Pick<Transforms, "x" | "y" | "scaleY" | "scaleX" | "scale">
const identity: Identity = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  scale: 1,
}

function frameAddsDistortion(frame: Frame) {
  return "scaleX" in frame || "scaleY" in frame || "scale" in frame || "x" in frame || "y" in frame
}

function getTransformDistortion(distortion?: Frame): Identity {
  if (!distortion) return identity
  if (!frameAddsDistortion(distortion)) return identity

  const scale = (distortion.scale as number) || identity.scale

  return {
    x: (distortion.x as number) || 0,
    y: (distortion.y as number) || 0,
    scaleX: (distortion.scaleX as number) || scale,
    scaleY: (distortion.scaleY as number) || scale,
    scale,
  }
}

export interface Props {
  layout?: boolean
}

export const useLayoutTransition = (
  driver: UseDriver,
  ref: React.RefObject<HTMLElement>,
  { layout }: Props,
  invertedRef: React.RefObject<HTMLElement>,
  transition?: Options
) => {
  const lastRect = React.useRef<Layout | null>(null)

  React.useLayoutEffect(() => {
    if (!ref.current || !layout) return

    const { top, left, right, bottom } = rect(ref)
    const distortion = driver.getCurrentTargetFrame()
    const offset = getTransformDistortion(distortion)

    const { from: current } = driver.resolveValues(undefined, identity)
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
    console.log({ oldRect, newRect, x })
    const flippedFrom = {
      x: (oldRect.right - newRect.right + oldRect.left - newRect.left) / 2 + x,
      y: (oldRect.bottom - newRect.bottom + oldRect.top - newRect.top) / 2 + y,
      scaleX: (oldRect.width * scaleX) / newRect.width,
      scaleY: (oldRect.height * scaleY) / newRect.height,
    }

    const invertedDistortion = getTransformDistortion(createComputedFrame(identity, invertedRef))
    const invertedAnimation = {
      from: {
        scaleX: invertedDistortion.scaleX,
        scaleY: invertedDistortion.scaleY,
      },
      to: { scaleX: offset.scaleX, scaleY: offset.scaleY },
    }
    console.log("DRIVER ANIMATE")
    driver.animate(
      {
        x: identity.x + offset.x,
        y: identity.y + offset.y,
        scaleX: identity.scaleX * offset.scaleX,
        scaleY: identity.scaleY * offset.scaleY,
      },
      Interaction.Layout,
      flippedFrom,
      invertedAnimation,
      transition
    )
  })
}
