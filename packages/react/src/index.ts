import { tags, Tags } from './utils/tags'
import { Animated, AnimatedProps } from './components/Animated'

export { driver } from '@spring-keyframes/driver'
export { useSpring } from './hooks/useSpring'
export { AnimateExit } from './components/AnimateExit'
export { KeyframesProvider } from './components/Keyframes'

const makeAnimated: {
  [K in Tags]?: React.FunctionComponent<AnimatedProps>
} = {}

export function newAnimated(tag: Tags) {
  return function() {
    let args = arguments[0]

    return Animated({ Tag: tag, ...args })
  }
}

tags.forEach(tag => {
  makeAnimated[tag] = newAnimated(tag)
})

export const animated = makeAnimated
