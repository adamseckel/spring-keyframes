import { identity } from './identity'

export function split(matrix: string) {
  if (matrix === 'none') return identity

  return matrix
    .split('(')[1]
    .split(')')[0]
    .split(',')
    .map(parseFloat) as number[]
}
