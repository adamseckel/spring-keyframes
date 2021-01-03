import React from "react"
import { Animate } from "@spring-keyframes/react"

import "./App.css"

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
      <Animate
        as="button"
        enterFrom={{ scale: 3 }}
        whileHover={{ scale: 2 }}
        whilePress={{ scale: 1.5 }}
        transition={{ damping: 10, stiffness: 200 }}
        style={{ width: 200, height: 200, background: "red", border: "none", outline: "none", transform: "scale(1.2)" }}
      />

      {/* <div
        style={{ display: "flex", justifyContent: isOn ? "space-around" : "space-between", width: 800, height: 200 }}>
        {[1, 2, 3].map((i) => (
          <Animate
            key={i}
            as={"div"}
            layout
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
            <CorrectLayoutDistortion as="div">
              <Animate
                as={"div"}
                whileHover={{ scale: 2 }}
                whilePress={{ scale: 1.5 }}
                style={{ width: "100%", height: 20, marginBottom: 10, background: "blue" }}
              />
            </CorrectLayoutDistortion>
          </Animate>
        ))}
      </div> */}
    </div>
  )
}

export default App
