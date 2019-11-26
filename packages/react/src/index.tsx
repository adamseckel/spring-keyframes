import * as React from 'react'
import { cx, css, keyframes } from 'emotion'
import { default as spring, Frame, Options } from '@spring-keyframes/driver'

interface Transition extends Options {
  delay?: number
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
  const { stiffness, damping, mass, precision, delay } = options
  const [frames, duration, ease] = spring(from, to, {
    stiffness,
    damping,
    mass,
    precision,
  })
  const animation = keyframes`${frames}`
  return [
    css`
      animation: ${animation} ${ease} ${duration} ${delay}ms 1 both;
    `,
    animation,
  ]
}

export interface AnimatedProps extends React.HTMLProps<HTMLDivElement> {
  /** Remove the Animated component and trigger its @exit animation. */
  show?: boolean
  /** A @Frame to animated to when @show is toggled to false. */
  exit?: Frame
  /** A @Frame to animate to when the Animated component mounts. */
  animate: Frame
  /** A @Frame to animate from when the Animated component mounts. */
  initial: Frame
  /** Define options for all of the Animated components transitions, including the spring, and delay. */
  transition?: Transition
}

export function Animated({
  animate: to,
  initial: from,
  transition: options,
  exit,
  show,

  children,
  style,
  className,

  ...rest
}: AnimatedProps) {
  const [shouldRender, setRender] = React.useState(show)
  const [initialClass, setInitialClass] = React.useState('')
  const [removeClass, setRemoveClass] = React.useState('')
  const removeNameRef = React.useRef<string>()

  React.useEffect(() => {
    if (show) setRender(true)
  }, [show])

  React.useEffect(() => {
    const [initial] = animatedClass({ from, to, options })
    setInitialClass(initial)
  }, [from, to, options, setInitialClass])

  React.useEffect(() => {
    const [remove, removeName] = animatedClass({
      from: to,
      to: exit || {},
      options,
    })

    removeNameRef.current = removeName

    setRemoveClass(remove)
  }, [to, exit, options, setRemoveClass])

  const onAnimationEnd = (e: React.AnimationEvent) =>
    !show && e.animationName === removeNameRef.current && setRender(false)

  return (
    shouldRender && (
      <div
        className={cx(className, !show ? initialClass : removeClass)}
        onAnimationEnd={onAnimationEnd}
        style={style}
        {...rest}>
        {children}
      </div>
    )
  )
}
