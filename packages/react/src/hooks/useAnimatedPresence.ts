import type { Driver } from "../Driver"
import type { Frame, Options } from "@spring-keyframes/driver"
import { useEffect, useRef, useLayoutEffect } from "react"
import { Interaction } from "../utils/Interaction"
import { useIsPresent } from "framer-motion"

export interface Props {
  enterFrom?: Frame
  exitTo?: Frame
}

export function useAnimatedPresence(driver: Driver, { enterFrom: from, exitTo: to }: Props, options?: Options) {
  const isPresent = useIsPresent()
  const mountRef = useRef(false)

  useEffect(() => {
    if (mountRef.current === false) mountRef.current = true
  }, [])

  useEffect(() => {
    if (isPresent === false) {
      driver.animate({ interaction: Interaction.Exit, to, options })
    }
  }, [isPresent])

  useLayoutEffect(() => {
    if (mountRef.current === false && from) driver.animate({ interaction: Interaction.Mount, from, options })
  }, [])
}
