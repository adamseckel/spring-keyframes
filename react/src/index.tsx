import * as React from 'react'
import { cx, css, keyframes } from 'emotion'
import { default as spring } from '@spring-keyframes/driver'

function animatedClass({ from, to, options = {} }: any) {
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
      animation: ${animation} ${ease} ${duration} ${delay}ms both;
    `,
    animation,
  ]
}

export function Animated({
  animate: to,
  initial: from,
  transition: options,
  exit,
  show,
  ...rest
}) {
  const [shouldRender, setRender] = React.useState(show)

  React.useEffect(() => {
    if (show) setRender(true)
  }, [show])

  const onAnimationEnd = e => !show && e === removeName && setRender(false)

  const [initial] = animatedClass({ from, to, options })
  const [remove, removeName] = animatedClass({ from: to, to: exit, options })

  return (
    shouldRender && (
      <div
        className={cx(rest.className, !show ? initial : remove)}
        onAnimationEnd={onAnimationEnd}
        style={rest.style}>
        {rest.children}
      </div>
    )
  )
}
