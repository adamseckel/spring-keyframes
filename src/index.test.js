import { spring } from './'

it('returns a keyframe array, with duplicate values removed', () => {
  const animation = spring({
    from: {
      opacity: 0,
      x: 0,
      scale: 0,
    },
    to: {
      opacity: 1,
      x: 100,
      scale: 1,
    },
  })

  expect(animation).toMatchSnapshot()
})
