import type { Frame, Property } from "@spring-keyframes/driver"
import type { Transforms } from "@spring-keyframes/matrix"

import { isTransform, identity } from "@spring-keyframes/matrix"
import { isUndefined } from "./typechecks"

export function onlyTargetProperties(target: Frame, current: Frame, transforms?: Partial<Transforms> | null) {
  const newFrame: Frame = {}
  const properties = Object.keys(target) as Property[]

  for (const property of properties) {
    if (isTransform(property) && transforms && !isUndefined(transforms[property])) {
      newFrame[property] = transforms[property]
    } else if (isUndefined(current[property])) {
      newFrame[property] = isTransform(property) ? identity[property] : 0
    } else if (property === "transformOrigin") {
      newFrame[property] = target.transformOrigin ?? "50% 50% 0"
    } else {
      newFrame[property] = current[property]
    }
  }

  return newFrame
}
