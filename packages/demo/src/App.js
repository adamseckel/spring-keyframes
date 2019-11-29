import React from 'react'
import logo from './logo.svg'
import './App.css'
import { default as driver } from '@spring-keyframes/driver'
import animated from '@spring-keyframes/react-emotion'

const list = [1, 2, 3, 4, 5]

function App() {
  const [visible, setVisible] = React.useState(true)
  const [frames, duration, ease] = driver(
    {
      opacity: 0,
    },
    { opacity: 1 }
  )
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {duration}
        {list.map(i => {
          return (
            <animated.li
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                stiffness: 280,
                damping: 8,
                mass: 1,
                delay: i * 100,
              }}
              exit={{ opacity: 1, scale: 2 }}
              show={visible}
              onClick={() => setVisible(!visible)}>
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
