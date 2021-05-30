import { createComputedFrame } from "./createComputedFrame"
import * as Style from "./computedStyle"

//@ts-ignore
import XCSSMatrix from "xcssmatrix"

jest.mock("./computedStyle")

it("returns an empty object no ref and no targetFrame is provided", () => {
  const frame = createComputedFrame(undefined, undefined)
  expect(frame).toEqual({})
})

it("returns the target frame if no ref is provided", () => {
  const frame = createComputedFrame({ scale: 1 }, undefined)
  expect(frame).toEqual({ scale: 1 })
})

it("returns only computed style if no target frame is provided", () => {
  const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
  const transform = new XCSSMatrix(undefined).translate(20, 10, 0).scale(2).toString()

  // @ts-ignore
  Style.default.mockReturnValue({
    backgroundColor: "red",
    transform,
  })

  const frame = createComputedFrame(undefined, ref)
  expect(frame).toMatchObject({ x: 20, y: 10, scale: 2, backgroundColor: "red" })
})

it("returns target properties if targetFrame is provided", () => {
  const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
  const transform = new XCSSMatrix(undefined).translate(20, 10, 0).scale(2).toString()

  // @ts-ignore
  Style.default.mockReturnValue({
    backgroundColor: "red",
    transform,
  })

  const frame = createComputedFrame({ scale: 1, x: 10, backgroundColor: "blue" }, ref)

  expect(frame).toEqual({
    backgroundColor: "red",
    x: 20,
    scale: 2,
  })
})
