import * as React from "react"
import { Frame } from "@spring-keyframes/driver"
import { useSpringKeyframes } from "../hooks/useSpringKeyframes"
import { useWhileInteraction } from "../hooks/useWhileInteraction"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: string
  whileHover?: Frame
  whilePress?: Frame
  onAnimationEnd?: () => void
}

export const AnimateInteractions = React.memo(function ({
  as = "div",
  whileHover,
  whilePress,
  onAnimationEnd,
  children,
  ...rest
}: Props) {
  const ref = React.useRef<HTMLElement>(null)
  const { animate } = useSpringKeyframes(ref, onAnimationEnd)

  useWhileInteraction(animate, ref, { whileHover, whilePress })

  return React.createElement(
    as,
    {
      ...rest,
      ref,
    },
    children
  )
})
