import * as React from 'react'
import { Tags } from './tags'
import { useSpring, Props } from './useSpring'
import { KeyframesContext } from './Keyframes'
import { useContext } from 'react'

export interface AnimatedProps extends Props, React.HTMLProps<HTMLElement> {
  Tag?: Tags
}

export function Animated({
  animate,
  initial,
  transition,
  exit,

  whileTap,
  whileHover,

  onEnd,

  children,
  style,

  Tag = 'div',

  ...rest
}: AnimatedProps): JSX.Element | false {
  const keyframes = useContext(KeyframesContext)

  const { ref } = useSpring({
    animate,
    initial,
    transition,
    exit,
    whileTap,
    whileHover,
    onEnd,
    keyframes,
  })

  return (
    <Tag
      //@ts-ignore
      style={{ willChange: 'animation', ...initial, ...style }}
      {...rest}
      ref={ref}>
      {children}
    </Tag>
  )
}
