// import { tags as Components, Tags } from "./utils/tags"
// // import { Animated, AnimatedProps } from './components/Animated'
// import * as React from "react"

export { driver } from "@spring-keyframes/driver"
// export { useSpring } from "./hooks/useSpring"
// export { AnimateExit } from "./components/AnimateExit"
export { AnimateInteractions } from "./components/AnimateInteractions"
export { AnimateState } from "./components/AnimateState"
export { AnimatePresence } from "./components/AnimatePresence"
export { AnimateLayout } from "./components/AnimateLayout"
// export { KeyframesProvider } from "./components/Keyframes"

// let makeAnimated: { [K in Tags]: any }

// export function newAnimated(tag: Tags) {
//   return function () {
//     let args = arguments[0]

//     return Animated({ Tag: tag, ...args })
//   }
// }
// // @ts-ignore
// makeAnimated = {}

// Components.forEach((Component) => {
//   makeAnimated[Component] = (props: AnimatedProps) =>
//     React.createElement(Animated, Object.assign({ Tag: Component }, props))
// })

// export const animated = makeAnimated
