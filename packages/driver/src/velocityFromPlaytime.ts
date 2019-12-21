import { Maxes, msPerFrame } from './index'
import { interpolate } from './interpolate'
import BezierEasing from 'bezier-easing'

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

export const velocityFromPlaytime = (
  toFrame: (val: number) => number,
  maxes: Maxes
) => (playTime: number): number => {
  const index = playTime / msPerFrame
  const frame = toFrame(index)

  // Get the closest known Max for the frame
  const max = closestFrameIndexForFrame(maxes, frame)
  const i = maxes.indexOf(max)
  if (maxes.length === i + 1) return 0
  const [high, low] = highLowFrame(maxes, frame, i)
  if (!low) return high[2]

  try {
    return interpolate(high[1], low[1], high[2], low[2], ease)(frame)
  } catch (error) {
    return 0
  }
}
