import { interpolate } from "./interpolate"
import { isNumber, isUndefined } from "./typechecks"
import { Frame, Property } from "./types"

export function resolveCurrentValues(
  resolveValue: (time: number) => number,
  from: Frame,
  to: Frame
): (time: number) => Frame {
  const resolvedValues: Frame = {}
  let properties = Object.keys(from) as Property[]

  return (time: number) => {
    const value = resolveValue(time)

    for (const property of properties) {
      const propertyValue = isNumber(from[property])
        ? Math.round(interpolate(0, 1, from[property] as number, to[property] as number)(value) * 10000) / 10000
        : value === 0
        ? from[property]
        : to[property]

      if (isUndefined(propertyValue)) continue

      resolvedValues[property] = propertyValue
    }

    return resolvedValues
  }
}
