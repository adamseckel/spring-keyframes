import * as React from 'react'
import { useAnimate } from '../hooks/useAnimate'
import { Frame } from '@spring-keyframes/driver'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: string
  enter?: Frame
  exit?: Frame
}

export function AnimatePresence({
  as = 'div',
  enter,
  exit,
  initial,
  ...rest
}: Props) {
  const { ref, play } = useAnimate({ callback, setState, state })


  return React.createElement(as, {
    ...rest,
    ref,
}
