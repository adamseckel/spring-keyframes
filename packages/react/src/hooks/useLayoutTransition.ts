import type * as React from "react"
import type { AxisTarget } from "../utils/Target"
import { Interaction } from "../utils/Interaction"
import { Driver } from "../Driver"
import { Frame, Options } from "@spring-keyframes/driver"
import { createComputedFrame } from "../utils/createComputedFrame"
import { progress, clamp, mix } from "popmotion"
import { useLayoutEffect, useEffect } from "react"
import { identity, Identity, Box } from "../components/Measurements"
import { useContext } from "react"
import { SpringContext } from "../components/Measurements"

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

export const useLayoutTransition = (
  driver: Driver,
  box: Box,
  { layout }: Props & { id: any },
  invertedRef: React.RefObject<HTMLElement>,
  options?: Options
) => {
  const { box: parentBox } = useContext(SpringContext)

  useLayoutEffect(() => {
    if (!box || !layout) return

    const offset = getTransformDistortion(driver.targetFrame)

    const { target: origin } = box.previous() ?? {}
    const parent = parentBox?.current() ?? parentBox?.measure()
    const { target, scale, transform } = box?.current() ?? box.measure(parent)

    if (!origin) {
      return
    }

    const hasTargetChanged =
      target.y.min !== origin.y.min ||
      target.x.min !== origin.x.min ||
      target.x.length !== origin.x.length ||
      target.y.length !== origin.y.length

    // console.log({ id, hasTargetChanged, origin, target })
    if (!hasTargetChanged) return

    const originX = calcOrigin(origin.x, target.x)
    const originY = calcOrigin(origin.y, target.y)
    const transformOrigin = `${originX * 100}% ${originY * 100}% 0`

    const invertedDistortion = getTransformDistortion(createComputedFrame(identity, invertedRef))
    // TODO: allow this to receive an uninverted x/y

    const x = (mix(target.x.min, target.x.max, originX) - mix(origin.x.min, origin.x.max, originX)) * -1 + transform.x
    const y = (mix(target.y.min, target.y.max, originY) - mix(origin.y.min, origin.y.max, originY)) * -1 + transform.y
    const invertedAnimation = {
      from: {
        scaleX: invertedDistortion.scaleX,
        scaleY: invertedDistortion.scaleY,
        // x: x,
        // y: y,
        transformOrigin: "50% 50% 0",
      },
      to: { scaleX: offset.scaleX, scaleY: offset.scaleY, transformOrigin: "50% 50% 0" },
    }

    driver.animate({
      interaction: Interaction.Layout,
      from: {
        x: x,
        y: y,
        scaleX: (origin.x.length * scale.x) / target.x.length,
        scaleY: (origin.y.length * scale.y) / target.y.length,
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

  useEffect(() => box.clear())

  return box
}
