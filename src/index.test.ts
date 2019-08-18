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

it('returns a keyframe array, with the passed unit', () => {
  const animation = spring(
    {
      from: {
        opacity: 0,
        x: 0,
      },
      to: {
        opacity: 1,
        x: 100,
      },
    },
    { unit: '%' }
  )

  expect(animation).toMatchSnapshot()
})

it('returns a keyframe array, with the desired precision', () => {
  const highPrecisionAnimation = spring(
    {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
    { precision: 4 }
  )

  expect(highPrecisionAnimation).toMatchSnapshot()

  const lowPrecisionAnimation = spring(
    {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
    { precision: 0 }
  )

  expect(lowPrecisionAnimation).toMatchSnapshot()
})
