import * as React from 'react'
import { Frame, Options } from '@spring-keyframes/driver'
import { Tags } from './tags'
import { useSpring } from './useSpring'

interface Transition extends Options {
  delay?: number
}

export interface AnimatedProps extends React.HTMLProps<HTMLElement> {
  /** A @Frame to animate to when the Animated component mounts. */
  animate: Frame
  /** A @Frame to animate from when the Animated component mounts. */
  initial: Frame
  /** Define options for all of the Animated components transitions, including the spring, and delay. */
  transition?: Transition
  /** A @Frame to animated to when @show is toggled to false. */
  exit?: Frame
  /** A @Frame to animate from while the Animated component is tapped. */
  whileTap?: Frame
  /** A @Frame to animate from while the Animated component is hovered. */
  whileHover?: Frame

  Tag?: Tags
}

export function Animated({
  animate,
  initial,
  transition,
  exit,

  whileTap,
  whileHover,

  children,
  style,

  Tag = 'div',

  ...rest
}: AnimatedProps): JSX.Element | false {
  const { ref } = useSpring({
    animate,
    initial,
    transition,
    exit,
    whileTap,
    whileHover,
  })

  return (
    //@ts-ignore
    <Tag
      //@ts-ignore
      style={{ willChange: 'animation' }}
      {...rest}
      ref={ref}>
      {children}
    </Tag>
  )
}
