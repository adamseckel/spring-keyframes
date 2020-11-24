import * as React from "react"
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect"
import { createTransformString, Frame } from "@spring-keyframes/driver"

export function usePersistedStyle(externalStyle?: React.CSSProperties) {
  const [style, setStyle] = React.useState(externalStyle)

  useDeepCompareEffectNoCheck(() => {
    setStyle(externalStyle)
  }, [externalStyle])

  const addStyle = React.useCallback((frame: Frame) => {
    setStyle((current) => addFrameStyle(current, frame))
  }, [])

  return [style, addStyle]
}

export function addFrameStyle(style: React.CSSProperties = {}, frame: Frame | undefined) {
  return Object.assign(
    style,
    frame,
    { x: undefined, y: undefined, scale: undefined, scaleX: undefined, scaleY: undefined },
    { transform: createTransformString(frame as any) }
  )
}
