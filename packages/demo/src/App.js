import React from 'react'
import logo from './logo.svg'
import './App.css'
import { animated, Animated } from '@spring-keyframes/react-emotion'

const list = [1]

function App() {
  const [visible, setVisible] = React.useState(true)
  const [paused, setPaused] = React.useState(false)
  setTimeout(() => {
    setVisible(false)
  }, 800)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {list.map(i => {
          return (
            <Animated
              key={i}
              initial={{ scale: 0.1, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: 100 }}
              exit={{scale: 0.1, opacity: 0, y: 0}}
              transition={{
                stiffness: 400,
                damping: 4,
                mass: 1,
              }}
              visible={visible}>
              Edit <code>src/App.js</code> and save to reload.
            </Animated>
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
