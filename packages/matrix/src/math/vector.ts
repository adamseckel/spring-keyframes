type Vector = number[]

export function dot(a: Vector, b: Vector) {
  let product = 0,
    n = a.length

  while (n--) {
    product += a[n] * b[n]
  }
  return product
}

export function modulus(vector: Vector) {
  return Math.sqrt(dot(vector, vector))
}

function dup(vector: Vector) {
  return [...vector]
}

function map(vector: Vector, fn: any, context?: any) {
  const elements: number[] = []
  forEach(vector, function(x: number, i: number) {
    elements.push(fn.call(context, x, i))
  })
  return elements
}

function forEach(vector: Vector, fn: any, context?: any) {
  for (var i = 0; i < vector.length; i++) {
    fn.call(context, vector[i], i + 1)
  }
}

export function toUnitVector(vector: Vector) {
  var r = modulus(vector)
  if (r === 0) return dup(vector)

  return map(vector, function(x: number) {
    return x / r
  })
}

export function cross(a: Vector, b: Vector) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}
