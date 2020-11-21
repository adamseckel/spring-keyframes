import { interpolate } from "./interpolate"

it("interpolates between positive output values", () => {
  const output = interpolate(1, 0, 100, 200)(0.5)

  expect(output).toBe(150)
})

it("interpolates between negative output values", () => {
  const output = interpolate(1, 0, -100, -200)(0.5)

  expect(output).toBe(-150)
})

it("interpolates between negative input values", () => {
  const output = interpolate(-1, 0, 100, 200)(-0.5)

  expect(output).toBe(150)
})
