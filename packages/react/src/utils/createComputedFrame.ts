import type { Frame } from "@spring-keyframes/driver"
import type { Transforms } from "@spring-keyframes/matrix"

import { fromMatrix } from "@spring-keyframes/matrix"
import { onlyTargetProperties } from "./onlyTargetProperties"
import computedStyle from "./computedStyle"

function collectTransforms(currentStyle: CSSStyleDeclaration): Transforms | null {
  if (!currentStyle.transform || currentStyle.transform === "none") return null
  return fromMatrix(currentStyle.transform)
}

export function createComputedFrame(targetFrame?: Frame, ref?: React.RefObject<HTMLElement>): Frame {
  if (!ref?.current && targetFrame) return targetFrame

  if (!ref?.current) return {}

  const currentStyle = computedStyle(ref.current)
  const transforms = collectTransforms(currentStyle)

  if (!targetFrame)
    return { ...currentStyle, ...transforms, transformOrigin: "50% 50% 0", transform: undefined } as Frame

  return onlyTargetProperties(targetFrame, currentStyle as Frame, transforms)
}
