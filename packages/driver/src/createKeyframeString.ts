import type { Keyframe, Property, Frame } from "./utils/types"
import { createKeyframe } from "./createKeyframe"

export const createKeyframeString = (percent: number, value: string) => `${percent}% {${value};}`

export function createSprungKeyframes(
  keyframes: Keyframe[],
  invertedKeyframes: Keyframe[],
  toFrame: (value: number) => number
) {
  let sprung = keyframes.length ? "" : undefined
  let inverted = invertedKeyframes.length ? "" : undefined

  for (let index = 0; index < keyframes.length; index++) {
    const [frame, value] = keyframes[index]

    const percent = Math.round(toFrame(frame) * 100) / 100
    sprung += createKeyframeString(percent, value) + "\n"

    if (invertedKeyframes.length) inverted += createKeyframeString(percent, invertedKeyframes[index][1]) + "\n"
  }

  return { sprung, inverted: invertedKeyframes ? inverted : undefined }
}

export function createTweenedKeyframes(from: Frame, to: Frame, tweened: Property[]) {
  const start = createKeyframe(from, to, 0, 0, tweened, true)
  const end = createKeyframe(from, to, 1, 1, tweened, true)
  if (start && end) return `${createKeyframeString(0, start[1])}${"\n"}${createKeyframeString(100, end[1])}`

  return undefined
}
