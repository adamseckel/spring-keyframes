import React from 'react'
import {
  animated,
  useSpring,
  AnimateExit,
  KeyframesProvider,
} from '@spring-keyframes/react'

export default function SizeTransition() {
  const [state, setState] = React.useState(false)
  const [width, height] = state ? [300, 200] : [200, 600]
  const margin = state ? 10 : 50

  return (
    <div
      style={{
        height: 1000,
        width: 400,
        background: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <animated.div
        layout
        onClick={() => setState(!state)}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.4 }}
        style={{
          background: 'red',
          overflow: 'visible',
          width,
          height,
        }}
        transition={{
          stiffness: 200,
          damping: 20,
          mass: 5,
          tweenedProps: [],
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <animated.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'white',
            }}></animated.div>
        </div>
      </animated.div>
    </div>
  )
}
