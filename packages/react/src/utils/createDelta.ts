import { Frame } from '@spring-keyframes/driver'

export function axisScaleForFrame(frame: Frame) {
  const scale = frame.scale
  const { scaleX = scale || 1, scaleY = scale || 1 } = frame

  return { scaleX, scaleY }
}

interface ScaleDistortion {
  scaleX: number
  scaleY: number
}

export function createDelta({ scaleX, scaleY }: ScaleDistortion) {
  return {
    scaleX: 1 / (1 / scaleX),
    scaleY: 1 / (1 / scaleY),
  }
}
