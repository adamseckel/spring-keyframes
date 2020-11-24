import { Options } from "@spring-keyframes/driver"

export interface Transition extends Options {
  /** Duration to delay initial animations in ms. Will not prevent child animations from playing. */
  delay?: number
}
