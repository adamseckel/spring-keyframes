import { default as spring } from './index'

it('returns a keyframe array, duration, and ease', () => {
  const animation = spring(
    { opacity: 0, width: 100, x: 0, y: 100, scale: 0 },
    { opacity: 1, width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(animation).toMatchSnapshot()
})

it('returns a keyframe array, duration, and ease for a long spring', () => {
  const animation = spring(
    { opacity: 0 },
    { opacity: 1 },
    { stiffness: 400, damping: 3 }
  )

  expect(animation).toMatchSnapshot()
})

it('returns a keyframe array, duration, and ease for a short spring', () => {
  const animation = spring(
    { opacity: 0 },
    { opacity: 1 },
    { stiffness: 2, damping: 3 }
  )

  expect(animation).toMatchSnapshot()
})
