import * as React from "react"
import { useSpringKeyframes } from "../hooks/useSpringKeyframes"

import { useLayoutTransition } from "../hooks/useLayoutTransition"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: any
  containerStyle?: React.CSSProperties
  onAnimationEnd?: () => void
}

type RefMap = Map<React.ReactText, React.MutableRefObject<HTMLElement>>

export const AnimateLayoutComplex = React.forwardRef(({
  as: Element = "div",
  onAnimationEnd,
  children,
  ...rest
}: Props, ref) => {
  const ref = React.useRef<HTMLElement>(null)
  const invertedRefs = React.useRef<RefMap>(new Map())
  const { animate, resolveValues } = useSpringKeyframes(ref, onAnimationEnd, invertedRefs)

  useLayoutTransition(animate, resolveValues, ref)

  const mapChildren = React.useCallback((child: React.ReactNode) => {
    
  }, [])

  return (
    <div>
      <div>
    <Element ref={ref} style={containerStyle} {...rest}>
      {React.Children.map(children, mapChildren)}
    </Element>
    </div>
  )
})

function enrichChildren(children: React.ReactChildren, invertedRefs: React.MutableRefObject<) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, {
      ref: (ref: React.MutableRefObject<HTMLElement>) => invertedRefs.current.set(child.key, ref),
    })
  })
}
