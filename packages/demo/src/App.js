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
        {/* <animated.div
          initial={{ scale: 0.1, opacity: 0.1, rotate: 0.1 }}
          animate={{ scale: 1, opacity: 1, rotate: 45 }}
         >
          <img src={logo} className="App-logo" alt="logo" />
        </animated.div> */}
        {/* <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 45 }}
          whileTap={{ scale: 2, opacity: 1, rotate: 45 }}
          whileHover={{ scale: 1.5, opacity: 1, rotate: 90 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </motion.div> */}
        <animated.div
          initial={{
            scale: 0,
            rotate: -50,
            opacity: 0,
            color: 'red',
          }}
          animate={{ scale: 1, rotate: 5, opacity: 1, color: 'blue' }}
          whileTap={{
            scale: 2,
            rotate: -10,
            opacity: 1,
            color: 'blue',
          }}
          whileHover={{
            scale: 1.5,
            rotate: 10,
            opacity: 0.4,
            color: 'red',
          }}
          transition={{
            stiffness: 200,
            damping: 4,
            mass: 1,
          }}>
          WOW
        </animated.div>

        <animated.div
          initial={{
            scale: 0,
            rotate: -50,
            opacity: 0,
          }}
          animate={{ scale: 1, rotate: 5, opacity: 1 }}
          whileTap={{
            scale: 2,
            rotate: -10,
            opacity: 1,
          }}
          whileHover={{
            scale: 1.5,
            rotate: 10,
            opacity: 0.4,
          }}
          transition={{
            stiffness: 200,
            damping: 4,
            mass: 1,
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="209" height="312">
            <g transform="translate(15.04 15.16) rotate(-11 94.298 133.959)">
              <g>
                <defs>
                  <linearGradient
                    id="idHfqgY2lShg-1824132296"
                    gradientTransform="rotate(135, 0.5, 0.5)">
                    <stop
                      offset="0"
                      stopColor="hsl(200, 100%, 63%)"
                      stopOpacity="1"></stop>
                    <stop
                      offset="1"
                      stopColor="hsl(223, 100%, 48%)"
                      stopOpacity="1"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M 162.483 1.078 C 158.858 -0.797 154.131 0.037 152.483 1.578 C 112.358 39.078 14.711 138.35 1.983 151.078 C -0.023 153.163 -0.475 156.762 0.483 159.578 C 1.44 162.394 4.537 165.078 8.983 165.078 C 31.569 165.078 64.809 165.078 90.483 165.078 C 97.398 165.078 104.608 164.203 111.483 159.578 C 118.358 154.953 117.356 152.806 119.983 145.578 C 120.887 143.088 163.983 9.078 163.983 9.078 C 163.983 9.078 166.108 2.953 162.483 1.078 Z"
                  fill="url(#idHfqgY2lShg-1824132296)"></path>
              </g>
              <g>
                <defs>
                  <linearGradient
                    id="idV5r3Zcpazg-1468443830"
                    gradientTransform="rotate(135, 0.5, 0.5)">
                    <stop
                      offset="0"
                      stopColor="hsl(349, 100%, 63%)"
                      stopOpacity="1"></stop>
                    <stop
                      offset="1"
                      stopColor="hsl(3, 94%, 68%)"
                      stopOpacity="1"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M 162.483 1.078 C 158.858 -0.797 154.131 0.037 152.483 1.578 C 112.358 39.078 14.711 138.35 1.983 151.078 C -0.023 153.163 -0.475 156.762 0.483 159.578 C 1.44 162.394 4.537 165.078 8.983 165.078 C 31.569 165.078 64.809 165.078 90.483 165.078 C 97.398 165.078 104.608 164.203 111.483 159.578 C 118.358 154.953 117.356 152.806 119.983 145.578 C 120.887 143.088 163.983 9.078 163.983 9.078 C 163.983 9.078 166.108 2.953 162.483 1.078 Z"
                  transform="translate(23.995 102.84) rotate(180 82.301 82.539)"
                  fill="url(#idV5r3Zcpazg-1468443830)"></path>
              </g>
              <g>
                <defs>
                  <linearGradient
                    id="idVXy6aq0XBg1934149842"
                    gradientTransform="rotate(228, 0.5, 0.5)">
                    <stop
                      offset="0"
                      stopColor="rgba(255, 255, 255, 0.81)"
                      stopOpacity="0.81"></stop>
                    <stop
                      offset="1"
                      stopColor="hsl(211, 100%, 79%)"
                      stopOpacity="1"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M 68.65 122.34 C 71.276 115.112 70.275 112.965 77.15 108.34 C 84.025 103.715 91.235 102.84 98.15 102.84 C 109.125 102.84 121.482 102.84 133.799 102.84 C 126.321 126.046 120.311 144.661 119.979 145.574 C 117.353 152.802 118.354 154.949 111.479 159.574 C 104.604 164.199 97.394 165.074 90.479 165.074 C 79.504 165.074 67.147 165.074 54.83 165.074 C 62.308 141.869 68.318 123.254 68.65 122.34 Z"
                  fill="url(#idVXy6aq0XBg1934149842)"></path>
              </g>
            </g>
          </svg>
        </animated.div>
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
      </header>
    </div>
  )
}

export default App
