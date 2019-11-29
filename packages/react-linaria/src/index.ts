import { animated as newAnimated } from './animated'
import { tags, Tags } from './tags'
import { AnimatedProps } from './Component'
import springDriver from '@spring-keyframes/driver'

//@ts-ignore
let makeAnimated: Record<Tags, React.ComponentProps<AnimatedProps>> = {}

tags.forEach(tag => {
  makeAnimated[tag] = newAnimated(tag)
})

export const driver = springDriver
export const animated = makeAnimated
