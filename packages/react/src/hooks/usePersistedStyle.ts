import * as React from "react"
import { createTransformString, Frame } from "@spring-keyframes/driver"

export function addFrameStyle(style: React.CSSProperties = {}, frame: Frame | undefined) {
  return Object.assign(
    style,
    frame,
    { x: undefined, y: undefined, scale: undefined, scaleX: undefined, scaleY: undefined },
    { transform: createTransformString(frame as any) }
  )
}
