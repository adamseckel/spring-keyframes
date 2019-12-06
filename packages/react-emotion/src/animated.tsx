import * as React from 'react'
import { Frame, Options } from '@spring-keyframes/driver'
import { Tags } from './tags'
import { useAnimated } from './useAnimated'
import { useWhileInteraction } from './useWhileInteraction'
import useDeepCompareEffect from 'use-deep-compare-effect'

interface Transition extends Options {
  delay?: number
}
const defaults = {
  stiffness: 380,
  damping: 20,
  mass: 1,
  precision: 0.01,
  velocity: 0,
}

export interface AnimatedProps extends React.HTMLProps<HTMLElement> {
  /** Remove the Animated component and trigger its @exit animation. */
  visible?: boolean
  /** A @Frame to animate to when the Animated component mounts. */
  animate: Frame
  /** A @Frame to animate from when the Animated component mounts. */
  initial: Frame
  /** Define options for all of the Animated components transitions, including the spring, and delay. */
  transition?: Transition
  /** A @Frame to animated to when @show is toggled to false. */
  exit?: Frame
  /** A @Frame to animate from while the Animated component is tapped. */
  whileTap?: Frame
  /** A @Frame to animate from while the Animated component is hovered. */
  whileHover?: Frame

  Tag?: Tags
}

export type Handler = {
  _mount: () => void
  _unMount: () => void
}

type Listeners = Record<string, Handler | null>

function removeAllListeners(listeners: Listeners) {
  Object.keys(listeners).forEach(key => {
    let handler = listeners[key]
    if (handler) handler._unMount()
  })
}

function restoreAllListeners(listeners: Listeners) {
  Object.keys(listeners).forEach(key => {
    let handler = listeners[key]
    if (handler) handler._mount()
  })
}

export function Animated({
  animate: to,
  initial: from,
  transition: options,
  exit,
  visible = true,

  whileTap,
  whileHover,

  children,
  style,

  Tag = 'div',

  ...rest
}: AnimatedProps): JSX.Element | false {
  const [shouldRender, setRender] = React.useState(true)
  const visibilityRef = React.useRef(false)

  const onEnd = () => {
    if (!visibilityRef.current) {
      removeAllListeners(FIXMEMountRef.current)
      setRender(false)
    }
  }

  const { ref, animateToFrame, handler } = useAnimated({
    from,
    to,
    onEnd,
    options: {
      ...defaults,
      ...options,
    },
  })

  const FIXMEMountRef = React.useRef<Record<string, Handler | null>>({
    initial: handler,
  })

  if (whileTap || whileHover) {
    FIXMEMountRef.current.tap = useWhileInteraction({
      ref,
      animateToFrame,
      from: to,
      whileHover,
      whileTap,
    })
  }

  // Deep compare the `animate|to` @Frame so that we can animate updates.
  useDeepCompareEffect(() => {
    console.log({ visible, to })
    if (visible && visible !== visibilityRef.current) {
      setRender(true)

      setTimeout(() => {
        restoreAllListeners(FIXMEMountRef.current)
        animateToFrame(to)
      }, 1)
    } else if (!visible && visible !== visibilityRef.current && exit) {
      animateToFrame(exit)
    } else if (visible) {
      animateToFrame(to)
    }

    visibilityRef.current = visible
  }, [visible, to])

  return (
    <>
      {shouldRender && (
        //@ts-ignore
        <Tag
          //@ts-ignore
          style={{ willChange: 'animation' }}
          {...rest}
          ref={ref}>
          {children}
        </Tag>
      )}
    </>
  )
}
