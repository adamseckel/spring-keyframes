import * as React from 'react'
import { useRef } from 'react'
import { useSpring, Props } from '../hooks/useSpring'
import { createTransformString } from '@spring-keyframes/driver'

export interface AnimatedProps extends Props, React.HTMLProps<HTMLElement> {
  Tag?: React.ElementType
  id?: string
}

export function Animated({
  animate,
  initial,
  transition,
  exit,

  whileTap,
  whileHover,

  onEnd,
  layout,

  children,
  style = {},

  Tag = 'div',

  ...rest
}: AnimatedProps) {
  const hasMounted = useRef(false)

  const { ref } = useSpring({
    mountRef: hasMounted,
    animate,
    initial,
    transition,
    exit,
    whileTap,
    whileHover,
    onEnd,
    layout,
  })

  const newStyle = hasMounted.current ? animate : initial

  const s = Object.assign({}, style, newStyle, {
    y: undefined,
    x: undefined,
    transform: createTransformString(newStyle),
  })

  return (
    <Tag ref={ref} {...rest} style={s}>
      {children}
    </Tag>
  )
}
