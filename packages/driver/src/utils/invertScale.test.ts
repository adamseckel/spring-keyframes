import { invertScale } from "./invertScale"

it("inverts a value based on a parent scale", () => {
  expect(invertScale(1, 2)).toBe(2)
  expect(invertScale(0.5, 2)).toBe(4)
  expect(invertScale(1, 0.5)).toBe(0.5)
  expect(invertScale(1.2, 1.2)).toBe(1)
})

it("returns a max scale if the input is too low", () => {
  expect(invertScale(0.0001, 1)).toBe(100000)
})
