import { default as spring } from './index'

it('returns an array of keyframe strings, duration', () => {
  const [animation, duration] = spring(
    { width: 100, x: 0, y: 100, scale: 0 },
    { width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it('returns an array of keyframe strings, and duration for a long spring', () => {
  const [animation, duration] = spring(
    { width: 100 },
    { width: 200 },
    { stiffness: 400, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it('returns an array of keyframe strings, and duration for a short spring', () => {
  const [animation, duration] = spring(
    { width: 0 },
    { width: 200 },
    { stiffness: 2, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it('returns an array of keyframe strings, and duration for a tweened animation', () => {
  const [animation, duration] = spring(
    { opacity: 0 },
    { opacity: 1 },
    { stiffness: 100, damping: 3 }
  )

  expect(animation[0]).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it('returns an array of keyframe strings, and duration for a tweened and sprung animation', () => {
  const [animations, duration] = spring(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3 }
  )

  expect(animations[0]).toMatchSnapshot()
  expect(animations[1]).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})
