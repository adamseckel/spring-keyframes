import { Properties } from "./types"

const axes = ["", "x", "y", "z"]
const properties = ["", "rotate", "scale"]

export const transforms: string[] = []

for (const axis of axes) {
  for (const prop of properties) transforms.push(`${prop}${prop ? axis.toUpperCase() : axis}`)
}

const color = "color"
const background = "background"
const backgroundColor = "backgroundColor"
const opacity = "opacity"
const transform = "transform"

export const unitless: Properties[] = [transform, opacity, color, background, backgroundColor]
export const tweened: Properties[] = [opacity, color, background, backgroundColor]
