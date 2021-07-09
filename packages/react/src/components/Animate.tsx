import * as React from "react"
import type { Options } from "@spring-keyframes/driver"
import { useDriver } from "../hooks/useDriver"
import { useCombinedRefs } from "../hooks/useCombinedRefs"
import { useAnimatedState, Props as UseAnimatedStateProps } from "../hooks/useAnimatedState"
import { useWhileInteraction, Props as UseWhileInteractionProps } from "../hooks/useWhileInteraction"
import { useLayoutTransition, Props as UseLayoutTransitionProps } from "../hooks/useLayoutTransition"
import { useAnimatedPresence, Props as UseAnimatedPresenceProps } from "../hooks/useAnimatedPresence"
import { Box, SpringContext } from "./Measurements"
import { useConstant } from "../hooks/useConstant"

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
  const invertedRef = React.useRef<HTMLElement>(null)
  const driver = useDriver(readWriteRef, onAnimationEnd, invertedRef)
  const hookProps = { animate, layout, whilePress, whileHover, enterFrom, exitTo, id: props.id }
  const box = useConstant(() => new Box(readWriteRef, driver))
  const context = useConstant(() => ({ box, invertedRef }))

  const transitionWithDefaults = {
    ...transition,
    tweened: [...(transition?.tweened ?? []), "opacity"],
  }

  useAnimatedState(driver, hookProps, transitionWithDefaults)
  useWhileInteraction(driver, readWriteRef, hookProps, transitionWithDefaults)
  useAnimatedPresence(driver, hookProps, transitionWithDefaults)
  useLayoutTransition(driver, box, hookProps, invertedRef, transitionWithDefaults)

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
        <SpringContext.Provider value={context}>
          {React.cloneElement(children, { ref: invertedRef })}
        </SpringContext.Provider>
      </Element>
    )
  }

  return (
    <Element ref={readWriteRef} {...props}>
      <SpringContext.Provider value={context}>{children}</SpringContext.Provider>
    </Element>
  )
})

export const CorrectLayoutDistortion = React.forwardRef<HTMLElement, { as?: any } & React.HTMLAttributes<HTMLElement>>(
  function ({ as: Element = "div", ...props }, ref) {
    return <Element ref={ref} {...props} />
  }
)
