import { playtimeToVelocity } from './playtimeToVelocity'
import { msPerFrame } from './msPerFrame'
import { Maxes } from './types'

it('determines a exact velocity for maxes', () => {
  const maxes = [
    [1, 0, 0, true],
    [0.5, 50, 0.5, true],
    [0, 100, 0, true],
  ] as Maxes
  const playtimeAtFrame = 50 * msPerFrame

  const velocity = playtimeToVelocity(maxes)(playtimeAtFrame)

  expect(velocity).toBe(0.5)
})

it('determines an eased velocity for maxes', () => {
  const maxes = [
    [1, 0, 0, true],
    [0.7, 40, 0.4, true],
    [0, 61, 0, true],
  ] as Maxes
  const playtimeAtFrame = 20 * msPerFrame

  const velocity = playtimeToVelocity(maxes)(playtimeAtFrame)

  expect(velocity).toBe(0.10064477651386015)
})

it('determines a negative eased velocity for maxes', () => {
  const maxes = [
    [1, 0, 0, true],
    [0.7, 40, -0.4, true],
    [0, 61, 0, true],
  ] as Maxes
  const playtimeAtFrame = 20 * msPerFrame

  const velocity = playtimeToVelocity(maxes)(playtimeAtFrame)

  expect(velocity).toBe(-0.10064477651386015)
})

it('returns 0 for playtimes greater than the final frame', () => {
  const maxes = [
    [1, 0, 0, true],
    [0.5, 50, 5, true],
    [0, 100, 0, true],
  ] as Maxes
  const playtimeAtFrame = 101 * msPerFrame

  const velocity = playtimeToVelocity(maxes)(playtimeAtFrame)

  expect(velocity).toBe(0)
})
