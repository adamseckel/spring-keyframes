import { Frame, Options } from "@spring-keyframes/driver"
import * as React from "react"
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect"
import { Interaction } from "../utils/types"
import { UseDriver } from "./useDriver"

interface Cache {
  hasMounted: boolean
  hasAnimated: boolean
  lastFrame?: Frame
}

export interface Props {
  animate?: Frame
}

export function useAnimatedState(driver: UseDriver, { animate: to }: Props, transition?: Options) {
  const cache = React.useRef<Cache>({
    hasMounted: false,
    hasAnimated: false,
    lastFrame: undefined,
  })

  useDeepCompareEffectNoCheck(() => {
    const { hasMounted, hasAnimated, lastFrame } = cache.current
    if (hasMounted && to) {
      const from = hasAnimated ? undefined : lastFrame
      driver.animate(to, Interaction.Animate, from, undefined, transition)
      cache.current.hasAnimated = true
    }
  }, [to])

  React.useEffect(() => {
    if (cache.current.hasMounted === false) cache.current = { hasMounted: true, lastFrame: to, hasAnimated: false }
  }, [])
}
