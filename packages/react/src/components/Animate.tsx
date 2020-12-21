import * as React from "react"
import { Options } from "@spring-keyframes/driver"
import { useDriver } from "../hooks/useDriver"
import { useCombinedRefs } from "../hooks/useCombinedRefs"
import { addFrameStyle } from "../hooks/usePersistedStyle"
import { useAnimatedState, Props as UseAnimatedStateProps } from "../hooks/useAnimatedState"
import { useWhileInteraction, Props as UseWhileInteractionProps } from "../hooks/useWhileInteraction"
import { useLayoutTransition, Props as UseLayoutTransitionProps } from "../hooks/useLayoutTransition"
import { useAnimatedPresence, Props as UseAnimatedPresenceProps } from "../hooks/useAnimatedPresence"

interface Props
  extends UseAnimatedStateProps,
    UseLayoutTransitionProps,
    UseWhileInteractionProps,
    UseAnimatedPresenceProps,
    React.HTMLAttributes<HTMLElement> {
  as: any
  transition?: Options
  onAnimationEnd?: () => void
}

export const Animate = React.forwardRef<HTMLElement, Props>(function (
  { as: Element = "div", onAnimationEnd, transition, children, ...props },
  ref
) {
  const innerRef = React.useRef<HTMLElement>(null)
  const readWriteRef = useCombinedRefs(innerRef, ref)
  const invertedRef = React.useRef<HTMLDivElement>(null)
  const driver = useDriver(readWriteRef, onAnimationEnd)

  useAnimatedState(driver, props, transition)
  useWhileInteraction(driver, readWriteRef, props, transition)
  useAnimatedPresence(driver, props, transition)
  useLayoutTransition(driver, readWriteRef, props, invertedRef, transition)

  return (
    <Element ref={readWriteRef} {...props} style={addFrameStyle(props.style, props.animate)}>
      {props.layout ? (
        <div ref={invertedRef} style={{ height: "100%", width: "100%", transformOrigin: "0% 50%" }}>
          {children}
        </div>
      ) : (
        children
      )}
    </Element>
  )
})
