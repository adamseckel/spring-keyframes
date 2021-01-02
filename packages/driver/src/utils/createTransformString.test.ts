import { createTransformString } from "./createTransformString"

it("returns an empty string if no transforms are set on style", () => {
  expect(createTransformString({})).toBe("")
})

it("returns a translate3d transform if any of x, y, or z are not undefined", () => {
  expect(createTransformString({ x: 20 })).toBe("translate3d(20px, 0px, 0px)")
})

it("returns a translate3d transform with x, y, z", () => {
  expect(createTransformString({ x: 20, y: 40, z: 60 })).toBe("translate3d(20px, 40px, 60px)")
})

it("returns a rotation transform", () => {
  expect(createTransformString({ rotate: 360 })).toBe("rotate3d(0, 0, 1, 360deg)")
})

it("returns a rotation transform with rotateZ", () => {
  expect(createTransformString({ rotateZ: 180 })).toBe("rotate3d(0, 0, 1, 180deg)")
})

it("returns a rotation transform with rotateZ prioritized over rotate", () => {
  expect(createTransformString({ rotate: 360, rotateZ: 180 })).toBe("rotate3d(0, 0, 1, 180deg)")
})

it("returns a transform for each rotation axis in order z, y, x", () => {
  expect(createTransformString({ rotate: 360, rotateX: 20, rotateY: 40 })).toBe(
    "rotate3d(0, 0, 1, 360deg) rotate3d(0, 1, 0, 40deg) rotate3d(1, 0, 0, 20deg)"
  )
})

it("returns a scale transform", () => {
  expect(createTransformString({ scale: 0.8 })).toBe("scale3d(0.8, 0.8, 1)")
})

it("returns a scale3d transform with scaleX or scaleY prioritized over scale", () => {
  expect(createTransformString({ scale: 0.8, scaleX: 2 })).toBe("scale3d(2, 0.8, 1)")
  expect(createTransformString({ scale: 0.8, scaleX: 2, scaleY: 0.5 })).toBe("scale3d(2, 0.5, 1)")
})

it("returns a scale3d transform with scaleX or scaleY prioritized over scale", () => {
  expect(createTransformString({ scale: 0.8, scaleX: 2 })).toBe("scale3d(2, 0.8, 1)")
  expect(createTransformString({ scale: 0.8, scaleX: 2, scaleY: 0.5 })).toBe("scale3d(2, 0.5, 1)")
})

it("stacks multiple transform types in order", () => {
  expect(createTransformString({ x: 20, y: 50, rotateX: 5, rotateZ: 20, scale: 0.8, scaleX: 2, scaleY: 0.5 })).toBe(
    "translate3d(20px, 50px, 0px) rotate3d(0, 0, 1, 20deg) rotate3d(1, 0, 0, 5deg) scale3d(2, 0.5, 1)"
  )
})
