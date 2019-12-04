import React from 'react'
import logo from './logo.svg'
import './App.css'
import { animated } from '@spring-keyframes/react-emotion'
import { motion } from 'framer-motion'
const list = [1]

function App() {
  const [visible, setVisible] = React.useState(true)
  const [warp, setWarp] = React.useState(false)

  return (
    <div className="App">
      <header className="App-header">
        {/* <animated.li
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            stiffness: 200,
            damping: 4,
            mass: 1,
          }}
          whileTap={{ scale: 2, opacity: 1 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </animated.li> */}
        <animated.div
          initial={{ scale: 0.1, opacity: 0.1, rotate: 0.1 }}
          animate={{ scale: 1, opacity: 1, rotate: 45 }}
          whileTap={{ scale: 2, opacity: 1, rotate: 45 }}
          whileHover={{ scale: 1.5, opacity: 1, rotate: 90 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </animated.div>
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 45 }}
          whileTap={{ scale: 2, opacity: 1, rotate: 45 }}
          whileHover={{ scale: 1.5, opacity: 1, rotate: 90 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </motion.div>
        {/* <div style={{ marginBottom: 100 }}></div>
        <button onClick={() => setWarp(!warp)}> toggle </button>
        <div style={{ marginBottom: 100 }}></div>

        <animated.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ rotate: warp ? 45 : 0, opacity: 1 }}
          transition={{
            stiffness: 200,
            damping: 4,
            mass: 1,
          }}>
          <img src={logo} className="App-logo" alt="logo" />
        </animated.div>
        <div style={{ marginBottom: 100 }}></div>
        <button onClick={() => setVisible(!visible)}> toggle </button>
        <div style={{ marginBottom: 100 }}></div>
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
        })} */}

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
