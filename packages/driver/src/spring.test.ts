import { spring } from './spring'

it('generates 2 frames for a dampened spring', () => {
  const [maxes, lastFrame] = spring({
    stiffness: 100,
    damping: 20,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    withInvertedScale: false,
    withEveryFrame: false,
  })

  expect(maxes).toBeInstanceOf(Array)
  expect(maxes.length).toBe(2)
  expect(lastFrame).toBe(61)
})

it('generates 12 frames for a stiff spring', () => {
  const [maxes, lastFrame] = spring({
    stiffness: 400,
    damping: 6,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    withInvertedScale: false,
    withEveryFrame: false,
  })

  expect(maxes).toBeInstanceOf(Array)
  expect(maxes.length).toBe(12)
  expect(lastFrame).toBe(102)
})

it("doesn't OOM for a spring with 0 damping", () => {
  const [maxes, lastFrame] = spring({
    stiffness: 400,
    damping: 0,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    withInvertedScale: false,
    withEveryFrame: false,
  })

  expect(maxes).toBeInstanceOf(Array)
  expect(lastFrame).toBeDefined()
})

it('generates a keyframe per frame when set', () => {
  const [maxes, lastFrame] = spring({
    stiffness: 400,
    damping: 6,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    withInvertedScale: false,
    withEveryFrame: true,
  })

  expect(maxes).toBeInstanceOf(Array)
  expect(maxes.length).toBe(103)
  expect(lastFrame).toBeDefined()
})

it('generates a keyframe per frame when invertedScale is set', () => {
  const [maxes, lastFrame] = spring({
    stiffness: 400,
    damping: 6,
    mass: 1,
    precision: 0.01,
    velocity: 0,
    withInvertedScale: true,
    withEveryFrame: false,
  })

  expect(maxes).toBeInstanceOf(Array)
  expect(maxes.length).toBe(103)
  expect(lastFrame).toBeDefined()
})
