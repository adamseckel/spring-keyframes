import * as React from "react"
import { Interaction } from "../utils/Interaction"
import { Driver } from "../Driver"
import { Frame, Options } from "@spring-keyframes/driver"
import { Transforms } from "@spring-keyframes/matrix"
import { createComputedFrame } from "../utils/createComputedFrame"

export type Layout = {
  left: number
  top: number
  bottom: number
  right: number
  height: number
  width: number
  deltaX: number
  deltaY: number
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
  id?: string
}

const clamp = (min: number, max: number, v: number) => {
  return Math.min(Math.max(v, min), max)
}
const clampProgress = (v: number) => clamp(0, 1, v)
const mix = (from: number, to: number, progress: number) => -progress * from + progress * to + from
const progress = (from: number, to: number, value: number) => {
  var toFromDifference = to - from
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference
}
function calcOrigin(min: number, max: number, length: number, tmin: number, tmax: number, tlength: number): number {
  let origin = 0.5

  if (tlength > length) {
    origin = progress(tmin, tmax - length, min)
  } else if (length > tlength) {
    origin = progress(min, max - tlength, tmin)
  }

  return clampProgress(origin)
}

export const useLayoutTransition = (
  driver: Driver,
  ref: React.RefObject<HTMLElement>,
  { layout, id }: Props,
  invertedRef: React.RefObject<HTMLElement>,
  options?: Options
) => {
  const lastRect = React.useRef<Layout | null>(null)

  React.useLayoutEffect(() => {
    if (!ref.current || !layout) return

    const { top, left, right, bottom } = rect(ref)
    const parent = rect({ current: ref.current.parentElement })
    const offset = getTransformDistortion(driver.targetFrame)

    const { from: current } = driver.resolveValues({ base: identity })
    const { scale = 1 } = current as Required<Transforms>
    const { x = 0, y = 0, scaleX = scale, scaleY = scale } = current as Required<Transforms>

    const newRect: Layout = {
      top: top - y + window.scrollY,
      bottom: bottom - y + window.scrollY,
      left: left - x + window.scrollX,
      right: right - x + window.scrollX,
      height: (bottom - top) / scaleY,
      width: (right - left) / scaleX,
      deltaX: left - parent.left,
      deltaY: top - parent.top,
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

    const originX = calcOrigin(oldRect.left, oldRect.right, oldRect.width, newRect.left, newRect.right, newRect.width)
    const originY = calcOrigin(oldRect.top, oldRect.bottom, oldRect.height, newRect.top, newRect.bottom, newRect.height)
    const transformOrigin = `${originX * 100}% ${originY * 100}% 0`

    lastRect.current = { ...newRect }
    const flippedFrom = {
      x: (mix(newRect.left, newRect.right, originX) - mix(oldRect.left, oldRect.right, originX)) * -1 + x,
      y: (mix(newRect.top, newRect.bottom, originY) - mix(oldRect.top, oldRect.bottom, originY)) * -1 + y,
      scaleX: (oldRect.width * scaleX) / newRect.width,
      scaleY: (oldRect.height * scaleY) / newRect.height,
      transformOrigin,
    }

    if (id === "X" || id === "A")
      console.log(id, {
        flippedFrom,
        x,
        y,
        oldRect,
        newRect,
        parent,
        transformOrigin,
      })

    const invertedDistortion = getTransformDistortion(createComputedFrame(identity, invertedRef))
    const invertedAnimation = {
      from: {
        scaleX: invertedDistortion.scaleX,
        scaleY: invertedDistortion.scaleY,
        transformOrigin,
      },
      to: { scaleX: offset.scaleX, scaleY: offset.scaleY, transformOrigin },
    }

    driver.animate({
      interaction: Interaction.Layout,
      to: {
        x: identity.x + offset.x,
        y: identity.y + offset.y,
        scaleX: identity.scaleX * offset.scaleX,
        scaleY: identity.scaleY * offset.scaleY,
        transformOrigin,
      },
      from: flippedFrom,
      invertedAnimation,
      options,
    })
  })
}
