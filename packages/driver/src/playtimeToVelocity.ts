import { Maxes, msPerFrame } from '.'
import BezierEasing from 'bezier-easing'
import { interpolate } from './interpolate'
const ease = BezierEasing(0.445, 0.05, 0.55, 0.95)

const closestFrameIndexForFrame = (counts: Maxes, goal: number) =>
  counts.reduce((prev, curr) =>
    Math.abs(curr[1] - goal) < Math.abs(prev[1] - goal) ? curr : prev
  )

const highLowFrame = (maxes: Maxes, frame: number, i: number) => {
  if (frame > maxes[i][1]) {
    return [maxes[i], maxes[i + 1]]
  }
  return [maxes[i - 1], maxes[i]]
}

export const playtimeToVelocity = (maxes: Maxes) => (
  playTime: number
): number => {
  const index = playTime / msPerFrame

  // Get the closest known Max for the frameIndex
  const max = closestFrameIndexForFrame(maxes, index)
  const i = maxes.indexOf(max)

  if (maxes.length === i + 1) return 0

  const [high, low] = highLowFrame(maxes, index, i)

  if (!low) return high[2]

  try {
    const tween = ease(interpolate(high[1], low[1], 0, 1)(index))

    return interpolate(high[1], low[1], high[2], low[2])(index) * tween
  } catch (error) {
    return 0
  }
}
