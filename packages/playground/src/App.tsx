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
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        position: "relative",
      }}>
      <AnimatePresence as="div" enterFrom={{ scale: 3 }} default={{ scale: 1 }}>
        <AnimateInteractions
          as="button"
          whileHover={{ scale: 2 }}
          whilePress={{ scale: 1.5 }}
          transition={{ damping: 10, stiffness: 200 }}
          style={{ width: 200, height: 200, background: "red", border: "none", outline: "none" }}
        />
      </AnimatePresence>

      <div
        style={{ display: "flex", justifyContent: isOn ? "space-around" : "space-between", width: 800, height: 200 }}>
        {[1, 2, 3].map((i) => (
          <AnimateLayout
            key={i}
            as={"div"}
            withInversion
            transition={{ damping: 20, stiffness: 100 }}
            style={{
              backgroundColor: "red",
              border: "1px solid blue",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              padding: 20,
              alignItems: "flex-start",
              width: 100,
            }}>
            <AnimateInteractions
              as={"div"}
              whileHover={{ scale: 2 }}
              whilePress={{ scale: 1.5 }}
              style={{ width: "100%", height: 20, marginBottom: 10, background: "blue" }}
            />
          </AnimateLayout>
        ))}
      </div>
    </div>
  )
}

export default App
