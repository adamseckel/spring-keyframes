import { Property } from './types'

const axes = ['', 'x', 'y', 'z']
const properties = ['', 'rotate', 'scale']

export const transforms: string[] = []

for (const axis of axes) {
  for (const prop of properties)
    transforms.push(`${prop}${prop ? axis.toUpperCase() : axis}`)
}

const color = 'color'
const background = 'background'
const backgroundColor = 'backgroundColor'
const opacity = 'opacity'
const transform = 'transform'

export const unitless: Property[] = [
  transform,
  opacity,
  color,
  background,
  backgroundColor,
]
export const tweened: Property[] = [opacity, color, background, backgroundColor]
