import { PhysicsSpringOptions, SpringOptions } from "popmotion"
import { findSpring, calcAngularFreq } from "./popmotion/findSpring"
import { msPerFrame } from "./msPerFrame"

const durationKeys = ["duration", "bounce"]
const physicsKeys = ["stiffness", "damping", "mass"]

function isSpringType(options: SpringOptions, keys: string[]) {
  return keys.some((key) => (options as any)[key] !== undefined)
}

function getSpringOptions(
  options: SpringOptions
): Required<PhysicsSpringOptions & { isResolvedFromDuration: boolean }> {
  let springOptions = {
    velocity: 0.0,
    stiffness: 100,
    damping: 10,
    mass: 1.0,
    isResolvedFromDuration: false,
    ...options,
  }

  // stiffness/damping/mass overrides duration/bounce
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    const derived = findSpring(options)

    springOptions = {
      ...springOptions,
      ...derived,
      velocity: 0.0,
      mass: 1.0,
    }

    springOptions.isResolvedFromDuration = true
  }

  return springOptions
}

export class Spring {
  private duration?: number
  private state = {
    done: false,
    velocity: 0,
    value: 0,
  }
  private options: Required<
    PhysicsSpringOptions & {
      isResolvedFromDuration: boolean
    }
  >

  public resolveSpring: (time: number) => number
  public resolveVelocity?: (time: number) => number

  constructor(
    from = 0,
    private readonly to = 1,
    private readonly restSpeed = 2,
    private readonly restDelta: number,
    options: any
  ) {
    this.duration = options.duration
    this.options = getSpringOptions(options)
    const { velocity, damping, stiffness, mass } = this.options

    this.state = {
      velocity,
      done: false,
      value: from,
    }

    const initialVelocity = velocity ? -(velocity / 1000) : 0.0
    const initialDelta = to - from
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass))
    const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1000

    /**
     * If we're working within what looks like a 0-1 range, change the default restDelta
     * to 0.01
     */
    restDelta ??= Math.abs(to - from) <= 1 ? 0.01 : 0.4

    if (dampingRatio < 1) {
      const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio)

      // Underdamped spring
      this.resolveSpring = (t: number) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t)

        return (
          to -
          envelope *
            (((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq) *
              Math.sin(angularFreq * t) +
              initialDelta * Math.cos(angularFreq * t))
        )
      }

      this.resolveVelocity = (t: number) => {
        // TODO Resolve these calculations with the above
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t)

        return (
          dampingRatio *
            undampedAngularFreq *
            envelope *
            ((Math.sin(angularFreq * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta)) /
              angularFreq +
              initialDelta * Math.cos(angularFreq * t)) -
          envelope *
            (Math.cos(angularFreq * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) -
              angularFreq * initialDelta * Math.sin(angularFreq * t))
        )
      }
    } else if (dampingRatio === 1) {
      // Critically damped spring
      this.resolveSpring = (t: number) =>
        to -
        Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t)
    } else {
      // Overdamped spring
      const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1)

      this.resolveSpring = (t: number) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t)

        // When performing sinh or cosh values can hit Infinity so we cap them here
        const freqForT = Math.min(dampedAngularFreq * t, 300)

        return (
          to -
          (envelope *
            ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) +
              dampedAngularFreq * initialDelta * Math.cosh(freqForT))) /
            dampedAngularFreq
        )
      }
    }
  }

  public next(t: number) {
    const current = this.resolveSpring(t)
    const currentVelocity = (this.resolveVelocity?.(t) ?? 0) * 1000

    if (!this.options.isResolvedFromDuration) {
      const isBelowVelocityThreshold = Math.abs(currentVelocity) <= this.restSpeed
      const isBelowDisplacementThreshold = Math.abs(this.to - current) <= this.restDelta!
      this.state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold
    } else {
      this.state.done = t >= this.duration!
    }
    this.state.velocity = currentVelocity
    this.state.value = this.state.done ? this.to : current
    return this.state
  }

  public forEach(cb: (value: number, duration: number, done: boolean) => void, detailed: boolean) {
    let done = false
    let lastVelocity: number = 0
    let index = 0

    while (!done) {
      const frame = this.next(msPerFrame * index)
      const isMaxAmplitude = (lastVelocity < 0 && frame.velocity > 0) || (lastVelocity > 0 && frame.velocity < 0)

      if (frame.done) done = true
      if (frame.velocity !== undefined) lastVelocity = frame.velocity

      if (detailed || isMaxAmplitude || index === 0 || done) cb(frame.value, index, done)

      index++
    }
  }
}
