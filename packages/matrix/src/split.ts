export function split(matrix: string) {
  if (matrix === 'none')
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] as number[]

  return matrix
    .split('(')[1]
    .split(')')[0]
    .split(',')
    .map(parseFloat) as number[]
}
