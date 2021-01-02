import { createKeyframe } from "./createKeyframe"
import { interpolate } from "./interpolate"
import { inverted } from "./types"

it("creates a keyframe tuple for the first frame", () => {
  const keyframe = createKeyframe({ opacity: 0 }, { opacity: 1 }, 0, 0)
  expect(keyframe).toEqual([0, "opacity: 0"])
})

it("creates a keyframe tuple for the last frame", () => {
  const keyframe = createKeyframe({ opacity: 0 }, { opacity: 1 }, 1, 100)
  expect(keyframe).toEqual([100, "opacity: 1"])
})

it("creates a keyframe tuple for an animation with transforms", () => {
  const keyframe = createKeyframe({ opacity: 0, scale: 0, x: 0 }, { opacity: 1, scale: 1, x: 1 }, 0, 0)
  expect(keyframe).toEqual([0, "opacity: 0; transform: translate3d(0px, 0px, 0px) scale3d(0, 0, 1)"])
})

it("if a property is included in the 'tweened' array, it's excluded from the output value", () => {
  const keyframe = createKeyframe({ opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }, 0, 0, ["opacity"])
  expect(keyframe).toEqual([0, "transform: scale3d(0, 0, 1)"])
})

it("if the desired output is an inverted keyframe, non-inversion properties are filtered out", () => {
  const keyframe = createKeyframe({ opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }, 0, 0, undefined, undefined, true)
  expect(keyframe).toEqual([0, "transform: scale3d(0, 0, 1)"])
})

it("if the desired output is an inverted keyframe, scale transforms are inverted", () => {
  const keyframe = createKeyframe(
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1 },
    1.4,
    0,
    undefined,
    undefined,
    true,
    inverted
  )
  expect(keyframe).toEqual([0, `transform: scale3d(${1 / 1.4}, ${1 / 1.4}, 1)`])
})

it("if the desired output is an inverted keyframe, and an invertedAnimation is supplied, scale transforms are inverted by the animation", () => {
  const invertedFrom = 1.3
  const invertedTo = 1.8
  const value = 1.4

  const keyframe = createKeyframe(
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1 },
    value,
    0,
    undefined,
    undefined,
    true,
    {
      from: {
        scale: invertedFrom,
      },
      to: {
        scale: invertedTo,
      },
    }
  )

  const invertedValue = Math.round(interpolate(0, 1, invertedFrom, invertedTo)(value) * 10000) / 10000
  expect(keyframe).toEqual([0, `transform: scale3d(${invertedValue / value}, ${invertedValue / value}, 1)`])
})
