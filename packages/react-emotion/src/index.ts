import { tags, Tags } from './tags'
// @ts-ignore
import { Animated, AnimatedProps } from './animated'
export { default as driver } from '@spring-keyframes/driver'
export { useSpring } from './useSpring'
export { AnimateExit } from './AnimateExit'
export { KeyframesProvider } from './Keyframes'

const makeAnimated = {}

export function newAnimated(tag: Tags) {
  return function() {
    let args = arguments[0]

    return Animated({ Tag: tag, ...args })
  }
}

tags.forEach(tag => {
  //@ts-ignore
  makeAnimated[tag] = newAnimated(tag)
})

export const animated = makeAnimated as Record<
  Tags,
  React.FunctionComponent<AnimatedProps>
>
