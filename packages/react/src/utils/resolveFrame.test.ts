import { resolveFrame } from "./resolveFrame"
import * as Style from "./computedStyle"
//@ts-ignore
import XCSSMatrix from "xcssmatrix"

jest.mock("./computedStyle")

it("if from and to are provided, it returns from and to extended with the base", () => {
  const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
  const base = { opacity: 0.5 }

  const from = { scale: 0 }
  const to = { scale: 1 }

  const { from: resolvedFrom, to: resolvedTo } = resolveFrame(ref, from, to, { base })

  expect(resolvedFrom).toEqual({ ...base, ...from })
  expect(resolvedTo).toEqual({ ...base, ...to })
})

it("if base and from are provided, it creates a to based on from's properties", () => {
  const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
  const base = { opacity: 0.5 }
  const identity = { color: "red", width: 20 }

  const from = { scale: 0, color: "blue" }
  const { from: resolvedFrom, to: resolvedTo } = resolveFrame(ref, from, undefined, {
    identity,
    base,
  })

  expect(resolvedFrom).toEqual({ ...base, ...from })
  expect(resolvedTo).toEqual({ ...base, scale: 1, color: "red" })
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

  const to = { scale: 0, color: "blue" }
  const { from: resolvedFrom, to: resolvedTo } = resolveFrame(
    ref,
    undefined,
    to,
    { identity: { width: 20 }, base: { opacity: 0.5 } },
    undefined,
    true
  )

  expect(resolvedFrom).toEqual({ ...lastResolvedFrame, scale: 2, color: "red" })
  expect(resolvedTo).toEqual({ ...lastResolvedFrame, ...to })
})

it("if isAnimating is false, and baseFrame, to, and lastResolvedFrame are provided, it generates a frame from to's properties", () => {
  const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
  const base = { opacity: 0.5 }
  const identity = { color: "red", width: 20 }

  const to = { scale: 0, color: "blue" }
  const { from: resolvedFrom, to: resolvedTo } = resolveFrame(ref, undefined, to, {
    identity,
    base,
  })

  expect(resolvedFrom).toEqual({ ...base, scale: 1, color: "red" })
  expect(resolvedTo).toEqual({ ...base, ...to })
})

it("if isAnimating is false, and baseFrame, and to are provided, it generates a frame from to's properties", () => {
  const ref = ({ current: true } as unknown) as React.RefObject<HTMLElement>
  const identity = { color: "red", width: 20 }

  const to = { scale: 0, color: "blue" }
  const { from: resolvedFrom, to: resolvedTo } = resolveFrame(ref, undefined, to, { identity })

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
  const base = { scale: 0.5, x: 50, opacity: 0.2 }
  const identity = { width: 20 }

  const { from: resolvedFrom, to: resolvedTo } = resolveFrame(
    ref,
    undefined,
    undefined,
    { identity, base, lastFrame: base },
    0,
    true
  )

  expect(resolvedFrom).toEqual({ ...base, scale: 1.2, opacity: 0.5, x: 20 })
  expect(resolvedTo).toEqual(base)
})
