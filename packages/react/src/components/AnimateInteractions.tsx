import * as React from 'react'
import { useAnimate } from '../hooks/useAnimate'
import { Frame } from '@spring-keyframes/driver'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: string
  initial: Frame
  whileHover?: Frame
  whilePress?: Frame
}

export function AnimateInteractions({
  as = 'div',
  whileHover,
  whilePress,
  initial,
  ...rest
}: Props) {
  const ref = React.useRef<HTMLElement>()
  const animate = useAnimate(ref, callback)

  useWhileInteraction({
    ref,
    play,
    from: to,
    whileHover,
    whileTap,
    setState,
    updateStyle,
  })

  return React.createElement(as, {
    ...rest,
    ref,
}
