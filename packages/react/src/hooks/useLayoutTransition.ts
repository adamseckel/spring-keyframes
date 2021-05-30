import type * as React from "react"
import { Interaction } from "../utils/Interaction"
import { Driver } from "../Driver"
import { Frame, Options } from "@spring-keyframes/driver"
import { Transforms } from "@spring-keyframes/matrix"
import { createComputedFrame } from "../utils/createComputedFrame"
import { progress, clamp, mix } from "popmotion"
import { useLayoutEffect, useRef } from "react"

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

const clampProgress = (v: number) => clamp(0, 1, v)
const calcOrigin = (source: AxisTarget, target: AxisTarget): number => {
  let origin = 0.5

  if (target.length > source.length) {
    origin = progress(target.min, target.max - length, source.min)
  } else if (source.length > target.length) {
    origin = progress(source.min, source.max - target.length, target.min)
  }

  return clampProgress(origin)
}

interface AxisTarget {
  min: number
  max: number
  length: number
}

interface Target {
  x: AxisTarget
  y: AxisTarget
}

export const useLayoutTransition = (
  driver: Driver,
  ref: React.RefObject<HTMLElement>,
  { layout }: Props,
  invertedRef: React.RefObject<HTMLElement>,
  options?: Options
) => {
  const snapshot = useRef<Target | null>(null)

  useLayoutEffect(() => {
    if (!ref.current || !layout) return

    const { top, left, right, bottom } = rect(ref)
    const offset = getTransformDistortion(driver.targetFrame)

    const { from: current } = driver.resolveValues({ base: identity })
    const { scale = 1 } = current as Required<Transforms>
    const { x = 0, y = 0, scaleX = scale, scaleY = scale } = current as Required<Transforms>

    const target: Target = {
      x: { min: left - x + window.scrollX, max: right - x + window.scrollX, length: (right - left) / scaleX },
      y: { min: top - y + window.scrollY, max: bottom - y + window.scrollY, length: (bottom - top) / scaleY },
    }

    if (snapshot.current === null) {
      snapshot.current = target
      return
    }

    const origin = snapshot.current
    const hasTargetChanged =
      target.y.min !== origin.y.min ||
      target.x.min !== origin.x.min ||
      target.x.length !== origin.x.length ||
      target.y.length !== origin.y.length

    if (!hasTargetChanged) return

    const originX = calcOrigin(origin.x, target.x)
    const originY = calcOrigin(origin.y, target.y)
    const transformOrigin = `${originX * 100}% ${originY * 100}% 0`

    snapshot.current = { x: { ...target.x }, y: { ...target.y } }

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
      from: {
        x: (mix(target.x.min, target.x.max, originX) - mix(origin.x.min, origin.x.max, originX)) * -1 + x,
        y: (mix(target.y.min, target.y.max, originY) - mix(origin.y.min, origin.y.max, originY)) * -1 + y,
        scaleX: (origin.x.length * scaleX) / target.x.length,
        scaleY: (origin.y.length * scaleY) / target.y.length,
        transformOrigin,
      },
      to: {
        x: identity.x + offset.x,
        y: identity.y + offset.y,
        scaleX: identity.scaleX * offset.scaleX,
        scaleY: identity.scaleY * offset.scaleY,
        transformOrigin,
      },

      invertedAnimation,
      options,
    })
  })
}
