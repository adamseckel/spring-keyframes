import * as React from "react"
import { Frame, Options } from "@spring-keyframes/driver"
import { useSpringKeyframes } from "../hooks/useSpringKeyframes"
import { useWhileInteraction } from "../hooks/useWhileInteraction"
import { useCombinedRefs } from "../hooks/useCombinedRefs"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: any
  whileHover?: Frame
  whilePress?: Frame
  transition?: Options
  onAnimationEnd?: () => void
}

interface InternalState {
  distortion?: Frame
  inverted?: boolean
}

export const AnimateInteractions = React.forwardRef<HTMLElement, Props>(function (
  { as: Element = "div", whileHover, whilePress, onAnimationEnd, transition, ...rest },
  ref
) {
  const internalState = React.useRef<InternalState>()
  const innerRef = React.useRef<HTMLElement>(null)
  const readWriteRef = useCombinedRefs(innerRef, ref)
  const { animate } = useSpringKeyframes(readWriteRef, onAnimationEnd)

  useWhileInteraction(animate, readWriteRef, { whileHover, whilePress }, transition)

  return <Element ref={readWriteRef} {...rest} />
})
