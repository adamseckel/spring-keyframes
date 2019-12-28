import { default as spring } from './index'

it('returns an array of keyframe strings, duration, and ease', () => {
  const [animation, duration, ease] = spring(
    { width: 100, x: 0, y: 100, scale: 0 },
    { width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('750ms')
  expect(ease).toMatchSnapshot()
})

it('returns an array of keyframe strings, and duration for a long spring', () => {
  const [animation, duration] = spring(
    { width: 100 },
    { width: 200 },
    { stiffness: 400, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('3250ms')
})

it('returns an array of keyframe strings, and duration for a short spring', () => {
  const [animation, duration] = spring(
    { width: 0 },
    { width: 200 },
    { stiffness: 2, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('5350ms')
})

it('returns an array of keyframe strings, and duration for a tweened animation', () => {
  const [animation, duration] = spring(
    { opacity: 0 },
    { opacity: 1 },
    { stiffness: 100, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of keyframe strings, and duration for a tweened and sprung animation', () => {
  const [animations, duration] = spring(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3 }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(animations[1]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of valid keyframes for camelCase properties', () => {
  const [animations, duration] = spring(
    { borderRadius: 0 },
    { borderRadius: 20 },
    { stiffness: 100, damping: 3 }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns tweened animations for all tweened property values', () => {
  const [animations, duration] = spring(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweenedProps: ['opacity', 'x'] }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns tweened animations for custom tweened property values', () => {
  const [animations, duration] = spring(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweenedProps: ['x'] }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(animations[1]).toMatchSnapshot()
  expect(duration).toBe('3133.33ms')
})

it('returns an array of valid keyframes for backgroundColor', () => {
  const [animations, duration] = spring(
    { backgroundColor: 'red' },
    { backgroundColor: 'blue' },
    { stiffness: 100, damping: 3 }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it('returns a velocity for a in-progress animation', () => {
  const [animations, duration, ease, convert] = spring(
    { x: 0 },
    { x: 400 },
    { stiffness: 100, damping: 2 }
  )

  expect(convert(400)).toBe(-0.10951148823495502)
  expect(ease).toBeDefined()
  expect(animations).toBeDefined()
  expect(duration).toBeDefined()
})
