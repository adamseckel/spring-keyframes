import { Frame, Property } from "@spring-keyframes/driver"
import * as React from "react"

export function computedFrame(targetFrame?: Frame, ref?: React.RefObject<HTMLElement>): Frame {
  if (!ref?.current && targetFrame) return targetFrame

  if (!ref?.current) return {}

  const currentStyle = getComputedStyle(ref.current)

  if (!targetFrame) return currentStyle

  return onlyTargetProperties(targetFrame, currentStyle)
}

function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

const identity = {
  scaleX: 1,
  scaleY: 1,
  x: 0,
  y: 0,
  translateX: 0,
  translateY: 0,
  scale: 1,
} as const

type Identity = keyof typeof identity

function isTransform(key: string): key is Identity {
  return key in identity
}

export function onlyTargetProperties(target: Frame, current: Frame) {
  const newFrame: Frame = {}
  const properties = Object.keys(target) as Property[]

  for (const property of properties) {
    const value = current[property]
    if (isTransform(property) && !isUndefined(value)) {
      newFrame[property] = typeof value === "number" ? value : parseInt(value)
    } else if (isUndefined(current[property])) {
      newFrame[property] = isTransform(property) ? identity[property] : 0
    } else {
      newFrame[property] = current[property]
    }
  }

  return newFrame
}
