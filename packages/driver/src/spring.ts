import { Options, Maxes, msPerFrame } from '.'
import { stepper } from './stepper'

interface Values {
  from: number
  to: number
}

// const enum Direction {
//   Up,
//   Down,
// }

export function spring({
  stiffness,
  damping,
  precision,
  mass,
  velocity,
  from,
  to,
}: Required<Options> & Values): [Maxes, number] {
  let lastValue = from,
    lastVelocity = velocity,
    lastFrame = 0,
    // direction: Direction | undefined = undefined,
    frame = 0,
    finalFrame = 0,
    maxes: Maxes = [[from, 0, velocity]]

  while (finalFrame === 0) {
    let [value, velocity] = stepper(
      msPerFrame / 1000,
      lastValue,
      lastVelocity,
      to,
      stiffness,
      damping,
      mass,
      precision
    )

    frame += 1

    if (velocity === 0) {
      maxes.push([to, frame, 0])
      finalFrame = frame
      break
    }

    if (
      (lastVelocity < 0 && velocity > 0) ||
      (lastVelocity > 0 && velocity < 0)
    ) {
      maxes.push([lastValue, lastFrame, lastVelocity])
    }

    lastValue = value
    lastVelocity = velocity
    lastFrame = frame
  }

  return [maxes, finalFrame]
}
