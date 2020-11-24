import * as React from "react"

import { Interaction } from "../utils/types"

import { Animate, ResolveValues } from "./useSpringKeyframes"
import { Transforms } from "@spring-keyframes/driver"
import { computedStyle } from "../utils/computedFrom"

export type Layout = {
  left: number
  top: number
  bottom: number
  right: number
  height: number
  width: number
}

const identity = {
  scaleX: 1,
  scaleY: 1,
  x: 0,
  y: 0,
}

// const keys = Object.keys(identity)

// function getRect(ref: React.RefObject<HTMLElement>) {
//   const { x = 0, y = 0, scaleX = 1, scaleY = 1 } = computedStyle(keys, ref)
//   const { top, left, right, bottom } = ref.current!.getBoundingClientRect()

//   return {
//     top,
//     left,
//     right,
//     bottom,
//     x,
//     y,
//     scaleX,
//     scaleY,
//   }
// }

function rect(ref: React.RefObject<HTMLElement>) {
  if (!ref.current) return { top: 0, left: 0, right: 0, bottom: 0 }

  const { top, left, right, bottom } = ref.current.getBoundingClientRect()
  return { top, left, right, bottom }
}

const transforms = {
  x: undefined,
  y: undefined,
  scaleX: undefined,
  scaleY: undefined,
  scale: undefined,
  translateX: undefined,
  translateY: undefined,
}

export const useLayoutTransition = (
  animate: Animate,
  resolveValues: ResolveValues,
  ref: React.RefObject<HTMLElement>
) => {
  const lastRect = React.useRef<Layout | null>(null)
  console.log("reeval")
  React.useLayoutEffect(() => {
    console.log("pre layout")
    if (!ref.current) return

    const { top, left, right, bottom } = rect(ref)
    const styles = computedStyle(["scaleX", "scaleY"], ref)
    const { from: current } = resolveValues(undefined, transforms)
    const { scale = 1 } = current as Required<Transforms>
    const { x = 0, y = 0, scaleX = scale, scaleY = scale } = current as Required<Transforms>
    console.log(styles, { x, y, scaleX, scaleY })

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
      console.log("no last rect")

      return
    }

    const oldRect = lastRect.current

    const hasRectChanged =
      newRect.top !== oldRect.top ||
      newRect.left !== oldRect.left ||
      newRect.height !== oldRect.height ||
      newRect.width !== oldRect.width

    console.log(hasRectChanged, "has changed")
    if (!hasRectChanged) return

    lastRect.current = { ...newRect }

    // const from = { scaleX, scaleY }
    // if (state.current.isInverted) {
    //   const inverted = computedStyleForElement(["scaleX", "scaleY"], ref.current.childNodes[0] as HTMLElement)

    //   from = {
    //     scaleX: scaleX * (inverted?.scaleX || 1),
    //     scaleY: scaleY * (inverted?.scaleY || 1),
    //   }
    // } else {

    // const invertedAnimation: InvertedAnimation = {
    //   from,
    //   to: { scaleX: 1, scaleY: 1 },
    // }

    const flippedFrom = {
      x: (oldRect.right - newRect.right + oldRect.left - newRect.left) / 2 + x,
      y: (oldRect.bottom - newRect.bottom + oldRect.top - newRect.top) / 2 + y,
      scaleX: (oldRect.width * scaleX) / newRect.width,
      scaleY: (oldRect.height * scaleY) / newRect.height,
    }

    console.log({ flippedFrom })

    animate(
      {
        x: identity.x,
        y: identity.y,
        scaleX: identity.scaleX,
        scaleY: identity.scaleY,
      },
      Interaction.Layout,
      flippedFrom
    )
  })
}
