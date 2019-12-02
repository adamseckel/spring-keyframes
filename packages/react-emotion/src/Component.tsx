import * as React from 'react'
import { cx, css, keyframes } from 'emotion'
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
  velocity: 0,
}

function animatedClass({
  from,
  to,
  options = {},
}: {
  from: Frame
  to: Frame
  options?: Transition
}): {
  className: string
  animation: string
  toFrame: (number: number) => [Frame, number]
} {
  const { stiffness, damping, mass, precision, delay } = {
    ...defaults,
    ...options,
  }
  const [frames, duration, ease, toFrame] = spring(from, to, {
    stiffness,
    damping,
    mass,
    precision,
  })
  const animation = keyframes`${frames}`
  return {
    className: css`
      animation: ${animation} ${ease} ${duration} ${delay ? `${delay}ms` : ''} 1
        both;
    `,
    animation,
    toFrame,
  }
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
}: AnimatedProps): JSX.Element | false {
  const [shouldRender, setRender] = React.useState(true)
  const [initialClass, setInitialClass] = React.useState('')
  const [removeClass, setRemoveClass] = React.useState('')
  const removeNameRef = React.useRef<string>()
  const runningRef = React.useRef<number | false>(false)
  const visibilityRef = React.useRef(false)
  const toFrameRef = React.useRef<any>()
  const elementRef = React.useRef<HTMLElement>()

  React.useEffect(() => {
    if (runningRef.current) {
      const dif = performance.now() - runningRef.current

      if (visible && !visibilityRef.current) {
        // Was exiting but now should cancel and enter.
      }
      if (!visible && visibilityRef.current) {
        // Was entering but should now cancel and exit.
        const [from, velocity] = toFrameRef.current(dif)
        const { className, animation } = animatedClass({
          from,
          to: exit || {},
          options: { ...options, velocity },
        })

        removeNameRef.current = animation

        setRemoveClass(className)
      }
    }

    if (!runningRef.current) {
      visibilityRef.current = visible
    }

    if (visible) setRender(true)
  }, [visible, setRemoveClass])

  React.useEffect(() => {
    const { className, toFrame } = animatedClass({ from, to, options })
    setInitialClass(className)
    toFrameRef.current = toFrame
    runningRef.current = performance.now()
  }, [from, to, options, setInitialClass])

  // React.useEffect(() => {
  //   console.log('called remove class make')
  //   const [remove, removeName] = animatedClass({
  //     from: to,
  //     to: exit || {},
  //     options,
  //   })

  //   removeNameRef.current = removeName

  //   setRemoveClass(remove)
  // }, [to, exit, options, setRemoveClass])

  const onAnimationEnd = (e: React.AnimationEvent) => {
    if (!visible && e.animationName === removeNameRef.current) {
      runningRef.current = false
      setRender(false)
    }

    if (visible && e.animationName === removeNameRef.current) {
      runningRef.current = false
    }
  }

  return (
    <>
      {shouldRender ? 'render' : 'no render'}
      {shouldRender && (
        //@ts-ignore
        <Tag
          //@ts-ignore
          {...rest}
          className={cx(className, !removeClass && initialClass, removeClass)}
          onAnimationEnd={onAnimationEnd}
          ref={elementRef}
          style={style}>
          {children}
        </Tag>
      )}
    </>
  )
}
