import { tags, Tags } from './tags'
import { Animated, AnimatedProps } from './Animated'
export { default as springDriver } from '@spring-keyframes/driver'
export { useInterupt as useSpring } from './useInterupt'

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
