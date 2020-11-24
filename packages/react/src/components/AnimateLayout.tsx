import * as React from "react"
import { useSpringKeyframes } from "../hooks/useSpringKeyframes"

import { useLayoutTransition } from "../hooks/useLayoutTransition"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: any
  containerStyle?: React.CSSProperties
  onAnimationEnd?: () => void
}

export const AnimateLayout = function ({
  as: Element = "div",
  onAnimationEnd,
  children,
  containerStyle,
  style,

  ...rest
}: Props) {
  const ref = React.useRef<HTMLElement>(null)
  const invertedRef = React.useRef<HTMLDivElement>(null)
  const { animate, resolveValues } = useSpringKeyframes(ref, onAnimationEnd, invertedRef)

  useLayoutTransition(animate, resolveValues, ref)

  return (
    <Element ref={ref} style={containerStyle} {...rest}>
      <div style={style} ref={invertedRef}>
        {children}
      </div>
    </Element>
  )
}
