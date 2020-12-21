import { Frame, Options } from "@spring-keyframes/driver"
import * as React from "react"
import { Interaction } from "../utils/types"
import { UseDriver } from "./useDriver"

export interface Props {
  enterFrom?: Frame
  default: Frame
  exitTo?: Frame
}

export function useAnimatedPresence(
  driver: UseDriver,
  { enterFrom, default: defaultStyle }: Props,
  transition?: Options
) {
  const mountRef = React.useRef(false)

  React.useEffect(() => {
    if (mountRef.current === false) mountRef.current = true
  }, [])

  React.useLayoutEffect(() => {
    if (mountRef.current === false && enterFrom)
      driver.animate(defaultStyle, Interaction.Mount, enterFrom, undefined, transition)
  }, [])
}
