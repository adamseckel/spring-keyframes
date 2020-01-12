import * as React from 'react'
import { useSpring, Props } from '../hooks/useSpring'

export interface AnimatedProps extends Props, React.HTMLProps<HTMLElement> {
  Tag?: React.ElementType
}

export function Animated({
  animate,
  initial,
  transition,
  exit,

  whileTap,
  whileHover,
  withPositionTransition,
  withSizeTransition,

  onEnd,

  children,

  Tag = 'div',

  ...rest
}: AnimatedProps) {
  const { ref } = useSpring({
    animate,
    initial,
    transition,
    exit,
    whileTap,
    whileHover,
    withPositionTransition,
    withSizeTransition,
    onEnd,
  })

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
