import { Frame, Options } from "@spring-keyframes/driver"
import * as React from "react"
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect"
import { Interaction } from "../utils/Interaction"
import { Driver } from "../Driver"

interface Cache {
  hasMounted: boolean
  hasAnimated: boolean
  lastFrame?: Frame
}

export interface Props {
  animate?: Frame
}

export function useAnimatedState(driver: Driver, { animate: to }: Props, options?: Options) {
  const cache = React.useRef<Cache>({
    hasMounted: false,
    hasAnimated: false,
    lastFrame: undefined,
  })

  useDeepCompareEffectNoCheck(() => {
    const { hasMounted, hasAnimated, lastFrame } = cache.current
    if (hasMounted && to) {
      driver.animate({ to, from: hasAnimated ? undefined : lastFrame, options, interaction: Interaction.Animate })
      cache.current.hasAnimated = true
    }
  }, [to])

  React.useEffect(() => {
    if (cache.current.hasMounted === false) cache.current = { hasMounted: true, lastFrame: to, hasAnimated: false }
  }, [])
}
