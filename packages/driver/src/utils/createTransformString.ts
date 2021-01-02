import * as React from "react"
import { isUndefined } from "./typechecks"

export type Transforms = {
  x?: number
  y?: number
  z?: number
  scale?: number
  rotate?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
}

enum Axis {
  X,
  Y,
  Z,
}

const isAxis = (axis: Axis, target: Axis) => (axis === target ? 1 : 0)

interface Axes {
  x?: number
  y?: number
  z?: number
}

function createRotate({ x, y, z }: Axes) {
  const axis = !isUndefined(x) ? Axis.X : !isUndefined(y) ? Axis.Y : Axis.Z
  const rotate = x || y || z
  return `rotate3d(${isAxis(axis, Axis.X)}, ${isAxis(axis, Axis.Y)}, ${isAxis(axis, Axis.Z)}, ${rotate}deg)`
}

function createScale({ x = 1, y = 1, z = 1 }: Axes) {
  return `scale3d(${x}, ${y}, ${z})`
}

function createTranslate({ x = 0, y = 0, z = 0 }: Axes) {
  return `translate3d(${x}px, ${y}px, ${z}px)`
}

export function createTransformString(style: Omit<React.CSSProperties, "scale" | "rotate"> & Transforms): string {
  const { x, y, z, scale, rotate, rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ } = style

  const transform = []

  // Translate.
  if (!isUndefined(x) || !isUndefined(y) || !isUndefined(z)) transform.push(createTranslate({ x, y, z }))

  const hasRotate = !isUndefined(rotate)
  const hasRotateZ = !isUndefined(rotateZ)

  // Stack rotates.
  if (hasRotate && !hasRotateZ) transform.push(createRotate({ z: rotate }))
  if (hasRotateZ) transform.push(createRotate({ z: rotateZ }))
  if (!isUndefined(rotateY)) transform.push(createRotate({ y: rotateY }))
  if (!isUndefined(rotateX)) transform.push(createRotate({ x: rotateX }))

  // Scale.
  const hasScale = !isUndefined(scale)
  const hasAxesScale = !isUndefined(scaleX) || !isUndefined(scaleY) || !isUndefined(scaleZ)

  if (hasScale && !hasAxesScale) transform.push(createScale({ x: scale, y: scale }))
  if (hasAxesScale) transform.push(createScale({ x: scaleX ?? scale, y: scaleY ?? scale, z: scaleZ }))

  return transform.join(" ")
}
