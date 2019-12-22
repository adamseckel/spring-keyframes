import { Options, Maxes, msPerFrame } from './'
import { stepper } from './stepper'

export function spring({
  stiffness,
  damping,
  precision,
  mass,
  velocity,
}: Required<Options>): [Maxes, number] {
  let lastValue = 1,
    lastVelocity = velocity,
    uncommitted = false,
    lastUncommittedValue = 1,
    lastUncommittedFrame = 0,
    lastUncommittedVelocity = velocity,
    frame = 0,
    lastFrame: number = 0,
    maxes: Maxes = [[1, 0, velocity]]

  while (lastFrame === 0) {
    let [value, velocity] = stepper(
      msPerFrame / 1000,
      lastValue,
      lastVelocity,
      0,
      stiffness,
      damping,
      mass,
      precision
    )

    frame += 1

    if (velocity === 0) {
      maxes.push([0, frame, 0])
      lastFrame = frame
      break
    }

    if (Math.abs(value) > Math.abs(lastValue)) {
      uncommitted = true
      lastUncommittedValue = value
      lastUncommittedFrame = frame
      lastUncommittedVelocity = velocity
    } else {
      if (uncommitted) {
        maxes.push([
          lastUncommittedValue,
          lastUncommittedFrame,
          lastUncommittedVelocity,
        ])
      }
      uncommitted = false
    }

    lastValue = value
    lastVelocity = velocity
  }

  return [maxes, lastFrame]
}
