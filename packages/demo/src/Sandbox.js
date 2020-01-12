import React from 'react'
// import './styles.css'
import { animated, AnimateExit } from '@spring-keyframes/react'

export default function App() {
  const [counter, setCounter] = React.useState(1)
  const [items, setItems] = React.useState([0])

  const removeItemAtIndex = index => {
    items.splice(index, 1)
    setItems([...items])
  }

  return (
    <div className="App">
      <h1
        onClick={() => {
          setCounter(counter + 1)
          setItems([counter, ...items])
        }}>
        Hello CodeSandbox
      </h1>
      <h2>Start editing to see some magic happen!</h2>

      <AnimateExit>
        {items.map((item, i) => (
          <animated.div
            key={item}
            withPositionTransition
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => removeItemAtIndex(i)}
            exit={{
              opacity: 0,
              transition: {
                type: 'ease',
                duration: 400,
              },
            }}
            style={{
              background: 'blue',
              width: 100,
              height: 50,
              marginBottom: 10,
            }}>
            {item}
          </animated.div>
        ))}
      </AnimateExit>
    </div>
  )
}
