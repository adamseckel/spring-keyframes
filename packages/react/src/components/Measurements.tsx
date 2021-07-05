import type { Target } from "../utils/Target"
import * as React from "react"
import { Driver } from "../Driver"
import { Transforms } from "@spring-keyframes/matrix"

export const SpringContext = React.createContext<{
  box?: Box
  invertedRef?: React.MutableRefObject<HTMLElement | null>
}>({
  box: undefined,
})

function rect(ref: React.RefObject<HTMLElement>) {
  if (!ref.current) return { top: 0, left: 0, right: 0, bottom: 0 }

  const { top, left, right, bottom } = ref.current.getBoundingClientRect()
  return { top, left, right, bottom }
}

export type Identity = Pick<Transforms, "x" | "y" | "scaleY" | "scaleX" | "scale">
export const identity: Identity = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  scale: 1,
}

interface EnhancedTarget {
  target: Target
  scale: { x: number; y: number }
  transform: { x: number; y: number }
}

function calcRelativeOffsetAxis(parent: Target["x"] | Target["y"], child: Target["x"] | Target["y"]) {
  return {
    min: child.min - parent.min,
    max: child.max - parent.min,
    length: child.length,
  }
}

function calcRelativeOffset(parent: Target, child: Target): Target {
  return {
    x: calcRelativeOffsetAxis(parent.x, child.x),
    y: calcRelativeOffsetAxis(parent.y, child.y),
  }
}

export class Box {
  constructor(private readonly ref: React.RefObject<HTMLElement>, private readonly driver: Driver) {}
  private target: EnhancedTarget | null = null
  private previousTarget: EnhancedTarget | null = null
  clear() {
    if (!this.target) return

    this.previousTarget = {
      target: { ...this.target.target },
      scale: { ...this.target.scale },
      transform: { ...this.target.transform },
    }
    this.target = null
  }
  previous(): EnhancedTarget | null {
    return this.previousTarget
  }
  current() {
    return this.target
  }
  measure(parentTarget?: EnhancedTarget): EnhancedTarget {
    const { top, left, right, bottom } = rect(this.ref)
    const { from: current } = this.driver.resolveValues({ base: identity })
    const { scale = 1 } = current as Required<Transforms>
    const { x = 0, y = 0, scaleX = scale, scaleY = scale } = current as Required<Transforms>

    const target = {
      x: { min: left - x + window.scrollX, max: right - x + window.scrollX, length: (right - left) / scaleX },
      y: { min: top - y + window.scrollY, max: bottom - y + window.scrollY, length: (bottom - top) / scaleY },
    }

    this.target = {
      target: parentTarget ? calcRelativeOffset(parentTarget.target, target) : target,
      transform: { x, y },
      scale: {
        x: scaleX,
        y: scaleY,
      },
    }

    return this.target
  }
}
