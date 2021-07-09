const axes = ["", "x", "y", "z"]
const properties = ["", "rotate", "scale"]

export const transforms: string[] = []

for (const axis of axes) {
  for (const prop of properties) transforms.push(`${prop}${prop ? axis.toUpperCase() : axis}`)
}

export const unitless = ["transform", "opacity", "color", "background", "backgroundColor", "transformOrigin"]
