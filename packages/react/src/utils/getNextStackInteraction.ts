import type { Stack } from "../types"

import { Interaction } from "./Interaction"

export function getNextStackInteraction(
  candidate: Interaction,
  stack: Stack,
  lastInteraction: Interaction | undefined
): Interaction {
  if (candidate === Interaction.None) {
    if (!lastInteraction) {
      // console.log("identity")

      return Interaction.Identity
    }
    // console.log({ stack, lastInteraction })
    for (let index = lastInteraction - 1; index > Interaction.None; index--) {
      const stackItem = stack?.has(index)
      if (stackItem) {
        // console.log("iterated")
        return index
      }
    }

    return Interaction.Identity
  } else if (lastInteraction && candidate < lastInteraction) {
    // console.log("lastInteraction")

    return lastInteraction
  }

  // console.log("candidate")

  return candidate
}
