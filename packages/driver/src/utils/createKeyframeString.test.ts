import { createKeyframeString } from "./createKeyframeString"

describe("createKeyframeString", () => {
  it("creates a valid css animation keyframe", () => {
    const value = "color: red"
    const percent = 20

    expect(createKeyframeString(percent, value)).toBe(`${percent}% {${value};}`)
  })
})

describe("createSprungKeyframes", () => {})

describe("createTweenedKeyframes", () => {})
