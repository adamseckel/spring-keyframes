import * as Properties from "./properties"

function camelCaseToDash(property: string) {
  return property.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase()
}

function unitForProp(prop: string) {
  return Properties.unitless.includes(prop) ? "" : "px"
}

const createCSSDeclaration = (property: string, value: string | number) =>
  `${camelCaseToDash(property)}: ${value}${unitForProp(property)}`

function createKeyframeValue(style: Record<string, any>) {
  const string = []
  for (const prop in style) {
    if (prop === "offset") continue
    string.push(createCSSDeclaration(prop, style[prop]))
  }
  return string.join("; ")
}

export const createKeyframeString = (
  offset: number,
  style: Record<string, any>,
  interpolate: (value: number) => number
) => `${Math.round(interpolate(offset) * 10000) / 100}% {${createKeyframeValue(style)};}`
