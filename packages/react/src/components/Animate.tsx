import * as React from "react"
import type { Options } from "@spring-keyframes/driver"
import { useDriver } from "../hooks/useDriver"
import { useCombinedRefs } from "../hooks/useCombinedRefs"
import { useAnimatedState, Props as UseAnimatedStateProps } from "../hooks/useAnimatedState"
import { useWhileInteraction, Props as UseWhileInteractionProps } from "../hooks/useWhileInteraction"
import { useLayoutTransition, Props as UseLayoutTransitionProps } from "../hooks/useLayoutTransition"
import { useAnimatedPresence, Props as UseAnimatedPresenceProps } from "../hooks/useAnimatedPresence"
import { usePresence } from "framer-motion"

interface Props
  extends UseAnimatedStateProps,
    UseLayoutTransitionProps,
    UseWhileInteractionProps,
    UseAnimatedPresenceProps,
    React.HTMLAttributes<HTMLElement> {
  as?: any
  transition?: Options
  onAnimationEnd?: () => void
}

export const Animate = React.forwardRef<HTMLElement, Props>(function (
  {
    as: Element = "div",
    onAnimationEnd,
    transition,
    children,
    animate,
    layout,
    whilePress,
    whileHover,
    enterFrom,
    exitTo,
    ...props
  },
  ref
) {
  const innerRef = React.useRef<HTMLElement>(null)
  const readWriteRef = useCombinedRefs(innerRef, ref)
  const invertedRef = React.useRef<HTMLDivElement>(null)
  const driver = useDriver(readWriteRef, onAnimationEnd, invertedRef)
  const hookProps = { animate, layout, whilePress, whileHover, enterFrom, exitTo }

  useAnimatedState(driver, hookProps, transition)
  useWhileInteraction(driver, readWriteRef, hookProps, transition)
  useAnimatedPresence(driver, hookProps, transition)
  useLayoutTransition(driver, readWriteRef, hookProps, invertedRef, transition)

  //style={addFrameStyle(props.style, props.animate)}

  if (
    layout &&
    React.Children.count(children) === 1 &&
    React.isValidElement(children) &&
    children.type === CorrectLayoutDistortion &&
    React.Children.only(children)
  ) {
    return (
      <Element ref={readWriteRef} {...props}>
        {React.cloneElement(children, { ref: invertedRef })}
      </Element>
    )
  }

  return (
    <Element ref={readWriteRef} {...props}>
      {children}
    </Element>
  )
})

export const CorrectLayoutDistortion = React.forwardRef<HTMLElement, { as?: any } & React.HTMLAttributes<HTMLElement>>(
  function ({ as: Element = "div", ...props }, ref) {
    return <Element ref={ref} {...props} />
  }
)
