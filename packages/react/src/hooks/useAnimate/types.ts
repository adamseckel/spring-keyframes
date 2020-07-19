import { Options } from '@spring-keyframes/driver'

export interface Transition extends Options {
  /** Duration to delay initial animations in ms. Will not prevent child animations from playing. */
  delay?: number
  /** Duration to run all animations in ms. */
  duration?: number
  /** Run a "spring" animation with some eased props, or use an "ease" timing function for all props. */
  type?: 'spring' | 'ease'
  /** Specify a timing function to use with "type: 'ease'". */
  timingFunction?: React.CSSProperties['animationTimingFunction']
}
