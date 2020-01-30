import React from 'react'
import { animated } from '@spring-keyframes/react'

export default function WhileInteraction() {
  const [sequence, setSequence] = React.useState(0)
  const currentSequenceRef = React.useRef(sequence)

  const nextSequence = () => {
    console.log('call')
    const next = currentSequenceRef.current + 1
    currentSequenceRef.current = next
    setSequence(next)
  }

  const sequenceMap = [
    { x: 200, y: 0 },
    { x: 200, y: 200 },
    { x: 0, y: 200 },
    { x: 0, y: 0 },
  ]

  return (
    <animated.div
      style={{
        width: 200,
        height: 200,
        background: 'red',
        borderRadius: 20,
        position: 'absolute',
      }}
      initial={{ ...sequenceMap[3], rotateZ: 0, rotateY: 0, rotateX: 0 }}
      animate={{
        ...sequenceMap[sequence % 4],
        rotateZ: (sequence + 1) * 90,
        rotateY: (sequence + 1) * 40,
        rotateX: (sequence + 1) * 30,
      }}
      onEnd={nextSequence}
      transition={{
        stiffness: 400,
        damping: 12,
        mass: 1,
      }}
    />
  )
}
