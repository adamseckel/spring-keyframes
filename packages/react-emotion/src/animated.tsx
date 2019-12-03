import * as React from 'react'
import { Frame, Options } from '@spring-keyframes/driver'
import { Tags } from './tags'
import { useAnimated } from './useAnimated'

interface Transition extends Options {
  delay?: number
}
const defaults = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  precision: 0.01,
  velocity: 0,
}

export interface AnimatedProps extends React.HTMLProps<HTMLElement> {
  /** Remove the Animated component and trigger its @exit animation. */
  visible?: boolean
  /** A @Frame to animated to when @show is toggled to false. */
  exit?: Frame
  /** A @Frame to animate to when the Animated component mounts. */
  animate: Frame
  /** A @Frame to animate from when the Animated component mounts. */
  initial: Frame
  /** Define options for all of the Animated components transitions, including the spring, and delay. */
  transition?: Transition
  /** A @Frame to animate from while the Animated component is tapped. */
  whileTap: Frame
  
  Tag?: Tags
}

export function Animated({
  animate: to,
  initial: from,
  transition: options,
  exit,
  visible = true,

  whileTap,

  children,
  style,
  className,

  Tag = 'div',

  ...rest
}: AnimatedProps): JSX.Element | false {
  const [shouldRender, setRender] = React.useState(true)
  const visibilityRef = React.useRef(false)

  const onEnd = () => {
    if (!visibilityRef.current) {
      _unMount()
      setRender(false)
    }
  }

  const { ref, animateToFrame, _mount, _unMount } = useAnimated({
    from,
    to,
    onEnd,
    options: {
      ...defaults,
      ...options,
    },
  })

  React.useEffect(() => {
    if (visible) {
      setRender(true)
      // Wait for the ref to be recreated.
      // This goes away when the component doesn't handle it's own visibility,
      // by implementing an AnimatePresence wrapper.
      setTimeout(() => {
        _mount()
        animateToFrame(to)
      }, 1)
    }
    if (!visible && exit) {
      animateToFrame(exit)
    }

    visibilityRef.current = visible
  }, [visible])

  const handleTouchEnd = () => animateToFrame(to)
  const handleTouchStart = () => animateToFrame(whileTap)

  return (
    <>
      {shouldRender && (
        //@ts-ignore
        <Tag
          //@ts-ignore
          {...rest}
          className={className}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          ref={ref}>
          {children}
        </Tag>
      )}
    </>
  )
}
