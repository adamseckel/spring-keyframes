import React from 'react'
import { animated, AnimateExit } from '@spring-keyframes/react'

export default function LayoutTransition() {
  const [list, setList] = React.useState([1])

  function push() {
    const next = Math.random()
    setList([next, ...list])
  }

  function remove(i) {
    list.splice(i, 1)
    setList([...list])
  }

  return (
    <>
      <button
        style={{ position: 'absolute', top: 10, left: 200 }}
        onClick={push}>
        toggle
      </button>
      <div style={{ marginBottom: 100 }}></div>
      <div style={{ height: 400 }}>
        <AnimateExit>
          {list.map((l, i) => (
            <animated.div
              withPositionTransition
              key={l}
              initial={{
                opacity: 0,
                y: -70,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                transition: {
                  type: 'ease',
                  duration: 200,
                },
              }}
              onClick={() => remove(i)}
              style={{
                height: 100,
                width: 100,
                background: 'purple',
                marginBottom: 50,
              }}
              transition={{
                stiffness: 400,
                damping: 10,
                tweenedProps: [],
              }}>
              {l}
            </animated.div>
          ))}
        </AnimateExit>
      </div>
    </>
  )
}
