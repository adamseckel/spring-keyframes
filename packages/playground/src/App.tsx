import React from "react"
import { AnimateInteractions, AnimateState, AnimatePresence, AnimateLayout, driver } from "@spring-keyframes/react"

import "./App.css"

const { sprung, inverted } = driver({ scale: 1 }, { scale: 2 }, { withInversion: true })
console.log({ sprung, inverted })
function App() {
  const [isOn, setIsOn] = React.useState(false)

  return (
    <div
      className="App"
      onClick={() => setIsOn(!isOn)}
      style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
      <AnimateState
        as="button"
        animate={{ scale: 1 }}
        style={{ width: 100, height: 30, background: "red", border: "none" }}
      />

      <AnimatePresence as="div" enterFrom={{ scale: 3 }} default={{ scale: 1 }}>
        <AnimateInteractions
          as="button"
          whileHover={{ scale: 2 }}
          whilePress={{ scale: 1.5 }}
          style={{ width: 200, height: 200, background: "red", border: "none" }}
        />
      </AnimatePresence>

      <div
        style={{ display: "flex", justifyContent: isOn ? "space-between" : "space-around", width: 800, height: 200 }}>
        {[1].map((i) => (
          <AnimateLayout
            key={i}
            as={AnimateInteractions}
            withInversion
            whileHover={{ scale: 2 }}
            transition={{ damping: 50, spring: 100 }}
            style={{
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid blue",
              width: 100,

              height: isOn ? 100 : 200,
            }}>
            <div style={{ width: 20, height: 20, background: "blue" }}></div>
            <div style={{ width: 20, height: 20, background: "blue" }}></div>
            <div style={{ width: 20, height: 20, background: "blue" }}></div>
          </AnimateLayout>
        ))}
      </div>
    </div>
  )
}

export default App
