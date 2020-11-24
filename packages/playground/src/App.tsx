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
          style={{ width: 100, height: 30, background: "red", border: "none" }}
        />
      </AnimatePresence>

      <AnimateLayout
        as={"div"}
        containerStyle={{ width: isOn ? 200 : 400, height: isOn ? 100 : 300, backgroundColor: "red" }}
        style={{ width: "100%", height: "100%", background: "yellow" }}>
        <AnimateLayout as={"div"} style={{ width: 20, height: 20, background: "blue" }}></AnimateLayout>
      </AnimateLayout>
    </div>
  )
}

export default App
