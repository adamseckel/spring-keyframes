import { driver, EASE } from './driver'

it('returns an array of keyframe strings, duration, and ease', () => {
  const [animation, duration, ease] = driver(
    { width: 100, x: 0, y: 100, scale: 0 },
    { width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('750ms')
  expect(ease).toBe(EASE)
})

it('returns an array of keyframe strings, and duration for a long spring', () => {
  const [animation, duration] = driver(
    { width: 100 },
    { width: 200 },
    { stiffness: 400, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('3250ms')
})

it('returns an array of keyframes for 0 value animations', () => {
  const [animation, duration] = driver(
    { scaleX: 0, x: 0, opacity: 0 },
    { scaleX: 1, x: 20, opacity: 1 },
    { stiffness: 400, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(animation[1]).toMatchSnapshot()
  expect(duration).toBe('3250ms')
})

it('returns an array of keyframe strings, and duration for a short spring', () => {
  const [animation, duration] = driver(
    { width: 0 },
    { width: 200 },
    { stiffness: 2, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('5350ms')
})

it('returns an array of keyframe strings, and duration for a tweened animation', () => {
  const [animation, duration] = driver(
    { opacity: 0 },
    { opacity: 1 },
    { stiffness: 100, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of keyframe strings, and duration for a tweened and sprung animation', () => {
  const [animations, duration] = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3 }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(animations[1]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of valid keyframes for camelCase properties', () => {
  const [animations, duration] = driver(
    { borderRadius: 0 },
    { borderRadius: 20 },
    { stiffness: 100, damping: 3 }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns tweened animations for all tweened property values', () => {
  const [animations, duration] = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweenedProps: ['opacity', 'x'] }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns tweened animations for custom tweened property values', () => {
  const [animations, duration] = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweenedProps: ['x'] }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(animations[1]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of valid keyframes for backgroundColor', () => {
  const [animations, duration] = driver(
    { backgroundColor: 'red' },
    { backgroundColor: 'blue' },
    { stiffness: 100, damping: 3 }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it('returns a velocity for a in-progress animation', () => {
  const [animations, duration, ease, convert] = driver(
    { x: 0 },
    { x: 400 },
    { stiffness: 100, damping: 2 }
  )
  expect(convert(400)).toBe(-0.015578297879179286)
  expect(ease).toBeDefined()
  expect(animations).toBeDefined()
  expect(duration).toBeDefined()
})

it('returns keyframes for scale props, for each frame when withInvertedScale is true', () => {
  const [animations, duration] = driver(
    { x: 0, scaleY: 0 },
    { x: 400, scaleY: 1 },
    { withInvertedScale: true }
  )

  expect(animations).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})
