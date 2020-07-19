import * as React from 'react'

const valueOrDefault = (v: number | undefined, d: number) =>
  v !== undefined ? v : d

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

export function createTransformString(
  style: Omit<React.CSSProperties, 'scale' | 'rotate'> & Transforms
): string {
  const {
    x,
    y,
    z,
    scale,
    rotate,
    rotateX,
    rotateY,
    rotateZ,
    scaleX,
    scaleY,
    scaleZ,
  } = style

  const transform = []

  if (x !== undefined || y !== undefined || z !== undefined) {
    transform.push(`translate3d(${x || 0}px, ${y || 0}px, ${z || 0}px)`)
  }

  // Stack rotates.
  if (rotate !== undefined) {
    transform.push(`rotate3d(0, 0, 1, ${rotate}deg)`)
  }
  if (rotateZ !== undefined && rotate === undefined) {
    transform.push(`rotate3d(0, 0, 1, ${rotateZ}deg)`)
  }
  if (rotateY !== undefined) {
    transform.push(`rotate3d(0, 1, 0, ${rotateY}deg)`)
  }
  if (rotateX !== undefined) {
    transform.push(`rotate3d(1, 0, 0, ${rotateX}deg)`)
  }

  if (scale !== undefined) {
    transform.push(
      `scale3d(${valueOrDefault(scale, 1)}, ${valueOrDefault(scale, 1)}, 1)`
    )
  } else if (
    scaleX !== undefined ||
    scaleY !== undefined ||
    scaleZ !== undefined
  ) {
    transform.push(
      `scale3d(${valueOrDefault(scaleX, 1)}, ${valueOrDefault(
        scaleY,
        1
      )}, ${valueOrDefault(scaleZ, 1)})`
    )
  }

  return transform.join(' ')
}
