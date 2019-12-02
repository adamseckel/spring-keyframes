import { tags, Tags } from './tags'
import { Animated } from './Animated'
import springDriver from '@spring-keyframes/driver'

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

export const driver = springDriver
export const animated = makeAnimated
