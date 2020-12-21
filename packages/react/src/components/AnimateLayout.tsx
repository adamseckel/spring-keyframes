import * as React from "react"
import { useDriver } from "../hooks/useDriver"
import { useCombinedRefs } from "../hooks/useCombinedRefs"

import { useLayoutTransition } from "../hooks/useLayoutTransition"
import { Options } from "@spring-keyframes/driver"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: any
  withInversion?: boolean
  transition?: Options
  onAnimationEnd?: () => void
}

export const AnimateLayout = React.forwardRef<HTMLElement, Props>(function (
  { as: Element = "div", onAnimationEnd, withInversion, children, onTransitionEnd, transition, ...rest }: Props,
  ref
) {
  const innerRef = React.useRef<HTMLElement>(null)
  const readRef = useCombinedRefs(ref, innerRef)
  const writeRef = React.useRef<HTMLDivElement>(null)
  const invertedRef = React.useRef<HTMLDivElement>(null)

  const driver = useDriver(writeRef, onAnimationEnd, readRef, invertedRef)

  useLayoutTransition(driver, readRef, { layout: true }, invertedRef, transition)

  return (
    <div
      ref={writeRef}
      style={{
        display: "inline-block",
        transformOrigin: "50% 50%",
        width: rest?.style?.width,
        height: rest?.style?.height,
      }}>
      <Element ref={readRef} {...rest} transition={transition} style={{ ...rest.style, height: "100%", width: "100%" }}>
        {withInversion ? (
          <div ref={invertedRef} style={{ height: "100%", width: "100%", transformOrigin: "0% 50%" }}>
            {children}
          </div>
        ) : (
          children
        )}
      </Element>
    </div>
  )
})
