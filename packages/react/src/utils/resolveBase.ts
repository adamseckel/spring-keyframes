import type { Frame } from "@spring-keyframes/driver"
import type { Stack } from "../types"

import { Interaction } from "./Interaction"

export function resolveBase(nextInteraction: Interaction, stack: Stack): Frame {
  const resolvedBase = {}

  for (let interaction = Interaction.Mount; interaction <= nextInteraction; interaction++) {
    if (stack.has(interaction)) Object.assign(resolvedBase, stack.get(interaction))
  }

  return resolvedBase
}
