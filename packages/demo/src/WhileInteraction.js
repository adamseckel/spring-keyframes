import React from 'react'
import { animated } from '@spring-keyframes/react'

export default function WhileInteraction() {
  return (
    <animated.div
      initial={{ scaleX: 1, scaleY: 1, x: 0, opacity: 0 }}
      animate={{ scaleX: 2, scaleY: 2, x: 50, opacity: 1 }}
      whileTap={{ scaleX: 3, scaleY: 3, x: 50, opacity: 1 }}
      style={{ background: 'red', webkitUserSelect: 'none' }}
      transition={{
        stiffness: 400,
        damping: 10,
        mass: 3,
        withInvertedScale: true,
        tweenedProps: [],
        delay: 0,
      }}>
      <p>some text</p>
    </animated.div>
  )
}
