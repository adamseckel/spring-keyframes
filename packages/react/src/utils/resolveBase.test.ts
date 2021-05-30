import { Interaction } from "./Interaction"
import { resolveBase } from "./resolveBase"

it("builds a base including all animated properties of lower priority the next interaction except Base", () => {
  expect(
    resolveBase(
      Interaction.Hover,
      new Map([
        [Interaction.Identity, { color: "red" }],
        [Interaction.Mount, { background: "blue" }],
        [Interaction.Animate, { width: 20 }],
        [Interaction.Hover, { height: 20 }],
      ])
    )
  ).toEqual({
    background: "blue",
    width: 20,
  })

  expect(
    resolveBase(
      Interaction.Hover,
      new Map([
        [Interaction.Identity, { color: "red" }],
        [Interaction.Animate, { width: 20 }],
        [Interaction.Hover, { height: 20 }],
      ])
    )
  ).toEqual({
    width: 20,
  })
})
