import * as React from "react"
import { Frame } from "@spring-keyframes/driver"
import { useSpringKeyframes } from "../hooks/useSpringKeyframes"
import { Interaction } from "../utils/types"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: string
  enterFrom?: Frame
  default: Frame
  exitTo?: Frame
  onAnimationEnd?: () => void
}

export const AnimatePresence = React.memo(function ({
  as = "div",
  enterFrom,
  exitTo,
  default: defaultStyle,
  onAnimationEnd,
  children,
  ...rest
}: Props) {
  const ref = React.useRef<HTMLElement>(null)
  const { animate } = useSpringKeyframes(ref, onAnimationEnd)
  const mountRef = React.useRef(false)

  React.useEffect(() => {
    if (mountRef.current === false) mountRef.current = true
  }, [])

  React.useLayoutEffect(() => {
    if (mountRef.current === false) animate(defaultStyle, Interaction.Mount, enterFrom)
  }, [])

  return React.createElement(
    as,
    {
      ...rest,
      ref,
    },
    children
  )
})
