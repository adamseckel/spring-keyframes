import * as React from 'react'
import { cx, css } from 'linaria'
import { default as spring, Frame, Options } from '@spring-keyframes/driver'
import { Tags } from './tags'
interface Transition extends Options {
  delay?: number
}
const defaults = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  precision: 0.01,
}

function animatedClass({
  from,
  to,
  options = {},
}: {
  from: Frame
  to: Frame
  options?: Transition
}) {
  const { stiffness, damping, mass, precision, delay } = {
    ...defaults,
    ...options,
  }
  const [frames, duration, ease] = spring(from, to, {
    stiffness,
    damping,
    mass,
    precision,
  })

  return css`
    @keyframes spring {
      ${frames}
    }
    animation: spring ${ease} ${duration} ${delay ? `${delay}ms` : ''} 1 both;
  `
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
  Tag?: Tags
}

export function Animated({
  animate: to,
  initial: from,
  transition: options,
  exit,
  visible = true,

  children,
  style,
  className,

  Tag = 'div',

  ...rest
}: AnimatedProps) {
  const [shouldRender, setRender] = React.useState(visible)
  const initial = animatedClass({ from, to, options })
  const remove = animatedClass({
    from: to,
    to: exit || {},
    options,
  })

  React.useEffect(() => {
    if (visible) setRender(true)
  }, [visible])

  const onAnimationEnd = (e: React.AnimationEvent) =>
    !visible && e.animationName === `spring-${remove}` && setRender(false)

  return (
    shouldRender && (
      //@ts-ignore
      <Tag
        {...rest}
        className={cx(className, visible ? initial : remove)}
        onAnimationEnd={onAnimationEnd}
        style={style}>
        {children}
      </Tag>
    )
  )
}
