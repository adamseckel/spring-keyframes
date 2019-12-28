import { playtimeToVelocity } from './playtimeToVelocity'
import { Maxes, msPerFrame } from '.'

it('determines a exact velocity for maxes', () => {
  const maxes = [[1, 0, 0], [0.7, 40, 0.4], [0, 61, 0]] as Maxes
  const playtimeAtFrame = 40 * msPerFrame

  const velocity = playtimeToVelocity(maxes)(playtimeAtFrame)

  expect(velocity).toBe(0.4)
})

it('determines an eased velocity for maxes', () => {
  const maxes = [[1, 0, 0], [0.7, 40, 0.4], [0, 61, 0]] as Maxes
  const playtimeAtFrame = 20 * msPerFrame

  const velocity = playtimeToVelocity(maxes)(playtimeAtFrame)

  expect(velocity).toBe(0.10064477651386015)
})

it('determines a negative eased velocity for maxes', () => {
  const maxes = [[1, 0, 0], [0.7, 40, -0.4], [0, 61, 0]] as Maxes
  const playtimeAtFrame = 20 * msPerFrame

  const velocity = playtimeToVelocity(maxes)(playtimeAtFrame)

  expect(velocity).toBe(-0.10064477651386015)
})
