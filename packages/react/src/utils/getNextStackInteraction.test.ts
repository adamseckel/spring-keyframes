import { getNextStackInteraction } from "./getNextStackInteraction"

import { Interaction } from "./Interaction"

it("returns the last interaction of the candidate is a lower priority", () => {
  const next = getNextStackInteraction(Interaction.Hover, new Map(), Interaction.Press)
  expect(next).toEqual(Interaction.Press)
})

it("returns the candidate if the candidate is not None, and greater than the last interaction", () => {
  const next = getNextStackInteraction(Interaction.Press, new Map(), Interaction.Hover)
  expect(next).toEqual(Interaction.Press)
})

it("returns the next highest-priority interaction if the candidate is None", () => {
  expect(getNextStackInteraction(Interaction.None, new Map([[Interaction.Identity, {}]]), Interaction.Hover)).toEqual(
    Interaction.Identity
  )

  expect(
    getNextStackInteraction(
      Interaction.None,
      new Map([
        [Interaction.Identity, {}],
        [Interaction.Animate, {}],
        [Interaction.Hover, {}],
        [Interaction.Press, {}],
      ]),
      Interaction.Hover
    )
  ).toEqual(Interaction.Animate)

  expect(
    getNextStackInteraction(
      Interaction.None,
      new Map([
        [Interaction.Identity, {}],
        [Interaction.Animate, {}],
        [Interaction.Hover, {}],
        [Interaction.Press, {}],
      ]),
      Interaction.Press
    )
  ).toEqual(Interaction.Hover)
})

it("returns Base if the candidate is None and there was no recent interaction", () => {
  const next = getNextStackInteraction(Interaction.None, new Map(), undefined)
  expect(next).toEqual(Interaction.Identity)
})
