import { driver, EASE } from './driver'

it('returns an array of keyframe strings, duration, and ease', () => {
  const { sprung, duration, ease } = driver(
    { width: 100, x: 0, y: 100, scale: 0 },
    { width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(sprung).toMatchSnapshot()
  expect(duration).toBe('750ms')
  expect(ease).toBe(EASE)
})

it('returns an array of keyframe strings, and duration for a long spring', () => {
  const { sprung, duration } = driver(
    { width: 100 },
    { width: 200 },
    { stiffness: 400, damping: 3 }
  )

  expect(sprung).toMatchSnapshot()
  expect(duration).toBe('3250ms')
})

it('returns an array of keyframes for 0 value animations', () => {
  const { sprung, tweened, duration } = driver(
    { scaleX: 0, x: 0, opacity: 0 },
    { scaleX: 1, x: 20, opacity: 1 },
    { stiffness: 400, damping: 3 }
  )

  expect(sprung).toMatchSnapshot()
  expect(tweened).toMatchSnapshot()
  expect(duration).toBe('3250ms')
})

it('returns an array of keyframe strings, and duration for a short spring', () => {
  const { sprung, duration } = driver(
    { width: 0 },
    { width: 200 },
    { stiffness: 2, damping: 3 }
  )

  expect(sprung).toMatchSnapshot()
  expect(duration).toBe('5350ms')
})

it('returns an array of keyframe strings, and duration for a tweened animation', () => {
  const { sprung, tweened, duration } = driver(
    { opacity: 0 },
    { opacity: 1 },
    { stiffness: 100, damping: 3 }
  )

  expect(tweened).toMatchSnapshot()
  expect(sprung).toBeUndefined()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of keyframe strings, and duration for a tweened and sprung animation', () => {
  const { tweened, sprung, duration } = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3 }
  )

  expect(sprung).toMatchSnapshot()
  expect(tweened).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of valid keyframes for camelCase properties', () => {
  const { sprung, duration } = driver(
    { borderRadius: 0 },
    { borderRadius: 20 },
    { stiffness: 100, damping: 3 }
  )

  expect(sprung).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns tweened animations for all tweened property values', () => {
  const { sprung, tweened, duration } = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweenedProps: ['opacity', 'x'] }
  )

  expect(tweened).toMatchSnapshot()
  expect(sprung).toBeUndefined()
  expect(duration).toBe('3133.33ms')
})

it('returns tweened animations for custom tweened property values', () => {
  const { sprung, tweened, duration } = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweenedProps: ['x'] }
  )

  expect(sprung).toMatchSnapshot()
  expect(tweened).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of valid keyframes for backgroundColor', () => {
  const { sprung, tweened, duration } = driver(
    { backgroundColor: 'red' },
    { backgroundColor: 'blue' },
    { stiffness: 100, damping: 3 }
  )

  expect(sprung).toBeUndefined()
  expect(tweened).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it('returns a velocity for a in-progress animation', () => {
  const { sprung, duration, ease, playTimeToVelocity } = driver(
    { x: 0 },
    { x: 400 },
    { stiffness: 100, damping: 2 }
  )
  expect(playTimeToVelocity(400)).toBe(-0.015578297879179286)
  expect(ease).toBeDefined()
  expect(sprung).toBeDefined()
  expect(duration).toBeDefined()
})

it('returns keyframes for scale props, for each frame when withInvertedScale is true', () => {
  const { sprung, inverted, duration, ease, playTimeToVelocity } = driver(
    { x: 0, scaleY: 0 },
    { x: 400, scaleY: 1 },
    { withInvertedScale: true }
  )

  expect(ease).toBeDefined()
  expect(playTimeToVelocity).toBeDefined()
  expect(duration).toMatchSnapshot()
  expect(sprung).toMatchSnapshot()
  expect(inverted).toMatchSnapshot()
})
