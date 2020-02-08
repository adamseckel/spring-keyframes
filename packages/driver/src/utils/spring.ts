import { msPerFrame } from './msPerFrame'
import { stepper } from './stepper'
import { Maxes, Options } from './types'

type Props = Required<
  Pick<
    Options,
    | 'stiffness'
    | 'damping'
    | 'precision'
    | 'mass'
    | 'velocity'
    | 'withInvertedScale'
    | 'withEveryFrame'
  >
>

export function spring({
  stiffness,
  damping,
  precision,
  mass,
  velocity,
  withInvertedScale,
  withEveryFrame,
}: Props): [Maxes, number] {
  let lastValue = 1,
    lastVelocity = velocity,
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
      damping === 0 ? 0.01 : damping,
      mass,
      precision
    )

    frame += 1

    if (velocity === 0) {
      maxes.push([0, frame, 0])
      lastFrame = frame
      break
    }

    const isMax =
      (lastVelocity < 0 && velocity > 0) || (lastVelocity > 0 && velocity < 0)

    const isEveryFrame = (withInvertedScale || withEveryFrame) && frame > 0

    if (isEveryFrame || isMax) maxes.push([value, frame, velocity])

    lastValue = value
    lastVelocity = velocity
  }

  return [maxes, lastFrame]
}
