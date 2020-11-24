import * as React from "react"
import { Frame } from "@spring-keyframes/driver"
import { useSpringKeyframes } from "../hooks/useSpringKeyframes"
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect"
import { Interaction } from "../utils/types"
import { addFrameStyle } from "../hooks/usePersistedStyle"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as: string
  animate?: Frame
  onAnimationEnd?: () => void
}

interface Cache {
  hasMounted: boolean
  hasAnimated: boolean
  lastFrame?: Frame
}

export const AnimateState = React.memo(function ({
  as = "div",
  animate: to,
  onAnimationEnd,
  children,
  ...rest
}: Props) {
  const ref = React.useRef<HTMLElement>(null)
  const { animate } = useSpringKeyframes(ref, onAnimationEnd)
  const cache = React.useRef<Cache>({
    hasMounted: false,
    hasAnimated: false,
    lastFrame: undefined,
  })

  useDeepCompareEffectNoCheck(() => {
    const { hasMounted, hasAnimated, lastFrame } = cache.current
    if (hasMounted && to) {
      const from = hasAnimated ? undefined : lastFrame
      animate(to, Interaction.Animate, from)
      cache.current.hasAnimated = true
    }
  }, [to])

  React.useEffect(() => {
    if (cache.current.hasMounted === false) cache.current = { hasMounted: true, lastFrame: to, hasAnimated: false }
  }, [])

  return React.createElement(
    as,
    {
      ...rest,
      style: addFrameStyle(rest.style, to),
      ref,
    },
    children
  )
})
