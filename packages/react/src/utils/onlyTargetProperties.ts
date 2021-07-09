import type { Frame } from "@spring-keyframes/driver"
import type { Transforms } from "@spring-keyframes/matrix"

import { isTransform, identity } from "@spring-keyframes/matrix"
import { isCSSStyleDeclaration } from "./computedStyle"
import { isUndefined } from "./typechecks"

export function onlyTargetProperties(
  target: Frame,
  current: CSSStyleDeclaration | Frame,
  transforms?: Partial<Transforms> | null
) {
  const newFrame: Frame = {}
  const properties = Object.keys(target)

  for (const property of properties) {
    let value = isCSSStyleDeclaration(current) ? current.getPropertyValue(property) : current[property]
    if (value === "none" && isTransform(property)) value = identity[property]
    if (isTransform(property) && transforms && !isUndefined(transforms[property])) {
      newFrame[property] = transforms[property]
    } else if (isUndefined(value)) {
      newFrame[property] = isTransform(property) ? identity[property] : 0
    } else if (property === "transformOrigin") {
      newFrame[property] = target.transformOrigin ?? "50% 50% 0"
    } else {
      newFrame[property] = value
    }
  }

  return newFrame
}
