import React from 'react'
import logo from './logo.svg'
import './App.css'
import {
  animated,
  useSpring,
  AnimateExit,
} from '@spring-keyframes/react-emotion'
import { motion } from 'framer-motion'
const list = [1]

function App() {
  const [visible, setVisible] = React.useState(true)
  const [warp, setWarp] = React.useState(false)
  // const { ref } = useSpring({
  //   initial: { scale: 0, rotate: -45 },
  //   animate: { scale: 1, rotate: 0 },
  //   transition: { stiffness: 200, damping: 4, mass: 1 },
  // })

  return (
    <div className="App">
      <header className="App-header">
        {/* <div ref={ref}> wowowowowow</div> */}
        <animated.div
          initial={{ width: 400, height: 400 }}
          animate={{ width: 100, height: 100 }}
          style={{ width: 100, height: 200 }}
          transition={{
            stiffness: 500,
            damping: 14,
            mass: 1,
          }}
          whileTap={{ width: 200, height: 200 }}>
          <div
            style={{ background: 'red', height: '100%', width: '100%' }}></div>
        </animated.div>
        {/* <animated.div
          initial={{ scale: 0.1, opacity: 0.1, rotate: 0.1 }}
          whileHover={{ scale: 1.5, opacity: 1, rotate: 90 }}
          whileTap={{ scale: 2, opacity: 1, rotate: 45 }}
          animate={{ scale: 1, opacity: 1, rotate: 45 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </animated.div>
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 45 }}
          whileTap={{ scale: 2, opacity: 1, rotate: 45 }}
          whileHover={{ scale: 1.5, opacity: 1, rotate: 90 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </motion.div> */}
        {/* <animated.div
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
          initial={{ scale: 0, opacity: 0 }}
          transition={{
            stiffness: 200,
            damping: 4,
            mass: 1,
          }}
          animate={{ scale: 1, opacity: 1 }}>
          <div style={{ position: 'relative' }}>
            <animated.div
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              transition={{
                stiffness: 200,
                damping: 4,
                mass: 1,
              }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 90 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="122.263"
                style={{
                  mixBlendMode: 'color-dodge',
                  position: 'absolute',
                  left: 30,
                  top: 100,
                }}
                height="177.854">
                <g>
                  <defs>
                    <linearGradient
                      id="idSWQcsECzWg1956077578"
                      gradientTransform="rotate(-58, 0.5, 0.5)">
                      <stop
                        offset="0"
                        stop-color="rgba(255, 25, 92, 1.00)"
                        stop-opacity="1"></stop>
                      <stop
                        offset="1"
                        stop-color="rgba(254, 71, 62, 1.00)"
                        stop-opacity="1"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="M 23.073 33.081 C 16.774 69.652 6.607 127.583 0.171 166.775 C -0.36 170.677 0.171 174.726 4.282 176.787 C 8.392 178.848 14.055 177.743 16.027 175.02 C 43.585 133.198 93.682 57.97 120.555 15.412 C 122.76 11.797 122.904 7.461 120.555 3.633 C 118.206 -0.195 112.899 -0.158 111.159 0.099 C 91.157 4.171 61.853 10.708 40.691 15.412 C 38.11 16.082 33.791 17.621 29.533 21.302 C 25.276 24.983 23.378 31.602 23.073 33.081 Z"
                    fill="url(#idSWQcsECzWg1956077578)"></path>
                </g>
              </svg>
            </animated.div>
            <animated.div
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              transition={{
                stiffness: 200,
                damping: 4,
                mass: 1,
              }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 90 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="122.263"
                style={{ mixBlendMode: 'normal' }}
                height="177.854">
                <g>
                  <defs>
                    <linearGradient
                      id="idRNSXsTle7g1796389668"
                      gradientTransform="rotate(123, 0.5, 0.5)">
                      <stop
                        offset="0"
                        stop-color="rgba(0, 78, 255, 1.00)"
                        stop-opacity="1"></stop>
                      <stop
                        offset="1"
                        stop-color="rgba(1, 211, 255, 1.00)"
                        stop-opacity="1"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="M 23.073 33.081 C 16.774 69.652 6.607 127.583 0.171 166.775 C -0.36 170.677 0.171 174.726 4.282 176.787 C 8.392 178.848 14.055 177.743 16.027 175.02 C 43.585 133.198 93.682 57.97 120.555 15.412 C 122.76 11.797 122.904 7.461 120.555 3.633 C 118.206 -0.195 112.899 -0.158 111.159 0.099 C 91.157 4.171 61.853 10.708 40.691 15.412 C 38.11 16.082 33.791 17.621 29.533 21.302 C 25.276 24.983 23.378 31.602 23.073 33.081 Z"
                    transform="rotate(180 61.132 88.927)"
                    fill="url(#idRNSXsTle7g1796389668)"></path>
                </g>
              </svg>
            </animated.div>
          </div>
        </animated.div> */}
      </header>
    </div>
  )
}

export default App
