export const enum Interaction {
  None,
  Identity,
  Mount,
  Layout,
  Animate,
  Hover,
  Press,
  Exit,
}

export const interactionPriority = [
  Interaction.Exit,
  Interaction.Layout,
  Interaction.Press,
  Interaction.Hover,
  Interaction.Animate,
  Interaction.Mount,
]
