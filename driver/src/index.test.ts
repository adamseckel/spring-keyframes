import { default as spring } from './index'

it('returns a keyframe array, duration, and ease', () => {
  const animation = spring(
    { opacity: 0, width: 100, x: 0, y: 100, scale: 0 },
    { opacity: 1, width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(animation).toMatchSnapshot()
})
