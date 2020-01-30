import React from 'react'
import {
  animated,
  useSpring,
  AnimateExit,
  KeyframesProvider,
} from '@spring-keyframes/react'

export default function SizeTransition() {
  const [randomContents, setRandomContents] = React.useState([4, 4])

  return (
    <animated.div
      withSizeTransition
      withPositionTransition
      onClick={() =>
        setRandomContents([
          Math.round(Math.random() * 5),
          Math.round(Math.random() * 5),
        ])
      }
      initial={{ opacity: 0, y: -70 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'purple',
        marginBottom: 50,
        marginTop: Math.max(randomContents[0] * 10, 10),
        transformOrigin: 'center center',
        overflow: 'hidden',
      }}
      transition={{
        stiffness: 400,
        damping: 10,
        tweenedProps: [],
        withInvertedScale: true,
      }}>
      <div
        style={{
          width: Math.max(randomContents[0] * 100, 100),
          background: 'purple',
          height: Math.max(randomContents[1] * 100, 100),
        }}></div>
    </animated.div>
  )
}
