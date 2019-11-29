import { animated } from './animated'
import { tags, Tags } from './tags'
import { AnimatedProps } from './Component'

//@ts-ignore
let makeAnimated: Record<Tags, React.ComponentProps<AnimatedProps>> = {}

tags.forEach(tag => {
  makeAnimated[tag] = animated(tag)
})

export default makeAnimated
