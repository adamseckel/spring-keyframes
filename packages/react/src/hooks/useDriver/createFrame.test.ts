import { createComputedFrame, createResolvedFrame } from "./createFrame"
import * as Style from "./computedStyle"
//@ts-ignore
import XCSSMatrix from "XCSSMatrix"

jest.mock("./computedStyle")

describe("createComputedFrame", () => {
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
})

describe("createResolvedFrame", () => {
  it("if from and to are provided, it returns from and to extended with lastResolvedFrame", () => {
    const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
    const lastResolvedFrame = { opacity: 0.5 }

    const from = { scale: 0 }
    const to = { scale: 1 }

    const { from: resolvedFrom, to: resolvedTo } = createResolvedFrame(ref, from, to, undefined, lastResolvedFrame)

    expect(resolvedFrom).toEqual({ ...lastResolvedFrame, ...from })
    expect(resolvedTo).toEqual({ ...lastResolvedFrame, ...to })
  })

  it("if baseFrame and from are provided, it creates a to based on from's properties", () => {
    const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
    const lastResolvedFrame = { opacity: 0.5 }
    const baseFrame = { color: "red", width: 20 }

    const from = { scale: 0, color: "blue" }
    const { from: resolvedFrom, to: resolvedTo } = createResolvedFrame(
      ref,
      from,
      undefined,
      baseFrame,
      lastResolvedFrame
    )

    expect(resolvedFrom).toEqual({ ...lastResolvedFrame, ...from })
    expect(resolvedTo).toEqual({ ...lastResolvedFrame, scale: 1, color: "red" })
  })

  it("if isAnimating is true, and baseFrame and to are provided, it generates a computed frame from to's properties", () => {
    const transform = new XCSSMatrix(undefined).translate(20, 10, 0).scale(2).toString()

    // @ts-ignore
    Style.default.mockReturnValue({
      opacity: 0.5,
      color: "red",
      transform,
    })

    const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
    const lastResolvedFrame = { opacity: 0.5 }
    const baseFrame = { width: 20 }

    const to = { scale: 0, color: "blue" }
    const { from: resolvedFrom, to: resolvedTo } = createResolvedFrame(
      ref,
      undefined,
      to,
      baseFrame,
      lastResolvedFrame,
      undefined,
      true
    )

    expect(resolvedFrom).toEqual({ ...lastResolvedFrame, scale: 2, color: "red" })
    expect(resolvedTo).toEqual({ ...lastResolvedFrame, ...to })
  })

  it("if isAnimating is false, and baseFrame, to, and lastResolvedFrame are provided, it generates a frame from to's properties", () => {
    const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
    const lastResolvedFrame = { opacity: 0.5 }
    const baseFrame = { color: "red", width: 20 }

    const to = { scale: 0, color: "blue" }
    const { from: resolvedFrom, to: resolvedTo } = createResolvedFrame(ref, undefined, to, baseFrame, lastResolvedFrame)

    expect(resolvedFrom).toEqual({ ...lastResolvedFrame, scale: 1, color: "red" })
    expect(resolvedTo).toEqual({ ...lastResolvedFrame, ...to })
  })

  it("if isAnimating is false, and baseFrame, and to are provided, it generates a frame from to's properties", () => {
    const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
    const baseFrame = { color: "red", width: 20 }

    const to = { scale: 0, color: "blue" }
    const { from: resolvedFrom, to: resolvedTo } = createResolvedFrame(ref, undefined, to, baseFrame)

    expect(resolvedFrom).toEqual({ scale: 1, color: "red" })
    expect(resolvedTo).toEqual(to)
  })

  it("if isAnimating is true, and baseFrame and lastResolvedFrame are provided, it generates a computed frame from lastResolvedFrame's properties and uses lastResolvedFrame as to", () => {
    const transform = new XCSSMatrix(undefined).translate(20, 10, 0).scale(1.2).toString()

    // @ts-ignore
    Style.default.mockReturnValue({
      opacity: 0.5,
      color: "red",
      transform,
    })

    const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
    const lastResolvedFrame = { scale: 0.5, x: 50, opacity: 0.2 }
    const baseFrame = { width: 20 }

    const { from: resolvedFrom, to: resolvedTo } = createResolvedFrame(
      ref,
      undefined,
      undefined,
      baseFrame,
      lastResolvedFrame,
      undefined,
      true
    )

    expect(resolvedFrom).toEqual({ ...lastResolvedFrame, scale: 1.2, opacity: 0.5, x: 20 })
    expect(resolvedTo).toEqual(lastResolvedFrame)
  })
})
