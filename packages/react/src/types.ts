import type { Options } from "@spring-keyframes/driver"
import type { Frame } from "@spring-keyframes/driver"
import type { Interaction } from "./utils/Interaction"

export interface Transition extends Options {
  /** Duration to delay initial animations in ms. Will not prevent child animations from playing. */
  delay?: number
}

export type Stack = Map<Interaction, Frame>
