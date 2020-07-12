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
        transformOrigin: 'center center',
        overflow: 'hidden',
      }}
      transition={{
        stiffness: 200,
        damping: 40,
        tweenedProps: [],
        withInvertedScale: true,
      }}>
      <div
        style={{
          width: Math.max(randomContents[0] * 100, 100),
          background: 'purple',
          height: Math.max(randomContents[1] * 100, 100),
        }}>
        <animated.p 
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}  
          whileHover={{opacity: 0.5, scale: 2}}  
          transition={{
            stiffness: 400,
            damping: 10,
            tweenedProps: [],
            
          }}  
          withPositionTransition>
            what
        </animated.p>
      </div>
    </animated.div>
  )
}
