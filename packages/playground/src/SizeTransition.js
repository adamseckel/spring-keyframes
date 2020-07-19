import React from 'react'
import {
  animated,
  useSpring,
  AnimateExit,
  KeyframesProvider,
} from '@spring-keyframes/react'

export default function SizeTransition() {
  const [state, setState] = React.useState(false)
  const [width, height] = state ? [300, 300] : [400, 400]
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'red',
          overflow: 'hidden',
          borderRadius: '10%',
          width,
          height,
        }}
        transition={{
          stiffness: 200,
          damping: 20,
          mass: 5,
          tweenedProps: [],
          withInvertedScale: true,
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
            whileHover={{ scale: 2 }}
            whileTap={{ scale: 0.5 }}
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
