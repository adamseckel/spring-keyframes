import React from 'react'
import logo from './logo.svg'
import './App.css'
import { animated } from '@spring-keyframes/react-emotion'

const list = [1]

function App() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div className="App">
      <header className="App-header">
        <animated.li
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            stiffness: 200,
            damping: 4,
            mass: 1,
          }}
          whileTap={{ scale: 2, opacity: 1 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </animated.li>
        <button onClick={() => setVisible(!visible)}> toggle </button>
        {list.map(i => {
          return (
            <animated.li
              key={i}
              initial={{ x: 0.1 }}
              animate={{ x: 400 }}
              exit={{ x: 0.1 }}
              transition={{
                stiffness: 200,
                damping: 4,
                mass: 1,
              }}
              visible={visible}>
              Edit <code>src/App.js</code> and save to reload.
            </animated.li>
          )
        })}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
