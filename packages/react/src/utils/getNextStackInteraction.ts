import type { Stack } from "../types"

import { Interaction } from "./Interaction"

export function getNextStackInteraction(
  candidate: Interaction,
  stack: Stack,
  lastInteraction: Interaction | undefined
): Interaction {
  if (candidate === Interaction.None) {
    if (!lastInteraction) return Interaction.Identity

    for (let index = lastInteraction - 1; index > Interaction.None; index--) {
      const stackItem = stack?.has(index)
      if (stackItem) return index
    }

    return Interaction.Identity
  } else if (lastInteraction && candidate < lastInteraction) {
    return lastInteraction
  }

  return candidate
}
