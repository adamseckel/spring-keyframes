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
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          onClick={() => setVisible(!visible)}
        />
        {list.map(i => {
          return (
            <animated.li
              key={i}
              initial={{ x: 0 }}
              animate={{ x: 400 }}
              exit={{ y: 0 }}
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
