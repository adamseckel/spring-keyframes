import { identity } from './identity'

export function diff(m1: number[] = identity, m2: number[] = identity) {
  const value = []

  for (let index = 0; index < m1.length; index++) {
    value.push(m1[index] - m2[index])
  }

  return value
}

export function add(m1: number[] = identity, m2: number[] = identity) {
  const value = []

  for (let index = 0; index < m1.length; index++) {
    value.push(m1[index] + m2[index])
  }

  return value
}
