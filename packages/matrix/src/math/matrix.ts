"use strict"

export type Row = [number, number, number, number]

export type Matrix2D = [
  [number, number, 0, 0],
  [number, number, 0, 0],
  [0, 0, 1, 0],
  [number, number, 0, 1]
]
export type Matrix3D = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
]

export type Matrix = Matrix3D

function dup(matrix: Matrix): Matrix {
  return [...matrix] as Matrix
}

function map(a: Matrix, fn: any, context?: any): Matrix {
  let i = a.length,
    j = 0
  const els = [],
    nj = a[0].length

  while (i--) {
    j = nj
    els[i] = [] as Partial<Row>
    while (j--) {
      els[i][j] = fn.call(context, a[i][j], i + 1, j + 1)
    }
  }

  return els as Matrix
}

// function isSameSizeAs(a: Matrix4X4, b: Matrix4X4) {
//   return a.length === b.length && a[0].length === b[0].length
// }

// function add(a: Matrix4X4, b: Matrix4X4): Matrix4X4 | null {
//   if (!isSameSizeAs(a, b)) return null

//   return map(a, function(x: any, i: any, j: any) {
//     return x + b[i - 1][j - 1]
//   })
// }

// function subtract(a: Matrix4X4, b: Matrix4X4): Matrix4X4 | null {
//   if (!isSameSizeAs(a, b)) return null

//   return map(a, function(x: any, i: any, j: any) {
//     return x - b[i - 1][j - 1]
//   })
// }

function canMultiplyFromLeft(a: Matrix, b: Matrix | Row) {
  // this.columns should equal matrix.rows
  return a[0].length === b.length
}

export function multiply(a: Matrix, b: Matrix): Matrix | null {
  if (typeof b === "number") {
    return map(a, function(x: number) {
      return x * b
    })
  }

  if (!canMultiplyFromLeft(a, b)) return null

  const nj = b[0].length,
    cols = a[0].length,
    elements = []

  let i = a.length,
    c: number,
    sum: number,
    j: number

  while (i--) {
    j = nj
    elements[i] = [] as Partial<Row>
    while (j--) {
      c = cols
      sum = 0
      while (c--) {
        sum += a[i][c] * b[c][j]
      }
      elements[i][j] = sum
    }
  }

  return elements as Matrix
}

// function minor(matrix: Matrix4X4, a: any, b: any, c: any, d: any): Matrix4X4 {
//   const elements = [],
//     rows = a.length,
//     cols = a[0].length

//   let ni = c,
//     i,
//     nj,
//     j

//   while (ni--) {
//     i = c - ni - 1
//     elements[i] = [] as Partial<Row>
//     nj = d
//     while (nj--) {
//       j = d - nj - 1
//       elements[i][j] = a[(a + i - 1) % rows][(b + j - 1) % cols]
//     }
//   }

//   return elements as Matrix4X4
// }

export function transpose(matrix: Matrix): Matrix {
  const rows = matrix.length,
    elements = [],
    cols = matrix[0].length
  let j: number,
    i = cols
  while (i--) {
    j = rows
    elements[i] = [] as Partial<Row>
    while (j--) {
      elements[i][j] = matrix[j][i]
    }
  }
  return elements as Matrix
}

// function max(matrix: Matrix4X4) {
//   const nj = matrix[0].length

//   let m = 0,
//     i = matrix.length,
//     j: number
//   while (i--) {
//     j = nj
//     while (j--) {
//       if (Math.abs(matrix[i][j]) > Math.abs(m)) {
//         m = matrix[i][j]
//       }
//     }
//   }
//   return m
// }

// function indexOf(matrix: Matrix4X4, x: number) {
//   const ni = matrix.length,
//     nj = matrix[0].length

//   for (let i = 0; i < ni; i++) {
//     for (let j = 0; j < nj; j++) {
//       if (matrix[i][j] === x) {
//         return {
//           i: i + 1,
//           j: j + 1,
//         }
//       }
//     }
//   }

//   return null
// }

function toRightTriangular(matrix: Matrix) {
  const newMatrix = dup(matrix)
  let els
  const n = matrix.length,
    np = matrix[0].length

  for (let i = 0; i < n; i++) {
    if (newMatrix[i][i] === 0) {
      for (let j = i + 1; j < n; j++) {
        if (newMatrix[j][i] !== 0) {
          els = []
          for (let p = 0; p < np; p++) {
            els.push(newMatrix[i][p] + newMatrix[j][p])
          }
          newMatrix[i] = els as Row
          break
        }
      }
    }

    if (newMatrix[i][i] !== 0) {
      for (let j = i + 1; j < n; j++) {
        const multiplier = newMatrix[j][i] / newMatrix[i][i]
        els = []
        for (let p = 0; p < np; p++) {
          // Elements with column numbers up to an including the number of the
          // row that we're subtracting can safely be set straight to zero,
          // since that's the point of this routine and it avoids having to
          // loop over and correct rounding errors later
          els.push(p <= i ? 0 : newMatrix[j][p] - newMatrix[i][p] * multiplier)
        }
        newMatrix[j] = els as Row
      }
    }
  }

  return newMatrix
}

export function determinant(matrix: Matrix): number {
  const newMatrix = toRightTriangular(matrix)
  const n = newMatrix.length

  let det = newMatrix[0][0]

  for (let i = 1; i < n; i++) {
    det = det * newMatrix[i][i]
  }

  return det
}

function isSingular(matrix: Matrix) {
  return determinant(matrix) === 0
}

// function trace(matrix: Matrix4X4) {
//   let tr = matrix[0][0]
//   const n = matrix.length
//   for (let i = 1; i < n; i++) {
//     tr += matrix[i][i]
//   }
//   return tr
// }

function augment(a: Matrix, b: Matrix) {
  const c = dup(a),
    cols = c[0].length,
    nj = b[0].length

  let i = c.length,
    j

  while (i--) {
    j = nj
    while (j--) {
      c[i][cols + j] = b[i][j]
    }
  }
  return c
}

function identity(n: number) {
  const els = []
  let i = n,
    j
  while (i--) {
    j = n
    els[i] = [] as Partial<Row>
    while (j--) {
      els[i][j] = i === j ? 1 : 0
    }
  }
  return els as Matrix
}

export function inverse(matrix: Matrix): Matrix | null {
  if (isSingular(matrix)) return null

  const n = matrix.length

  let i = n,
    j,
    els,
    divisor,
    new_element
  const newMatrix = toRightTriangular(augment(matrix, identity(n)))
  const np = newMatrix[0].length,
    invertedMatrix = []

  // Matrix is non-singular so there will be no zeros on the
  // diagonal. Cycle through rows from last to first.
  while (i--) {
    // First, normalise diagonal elements to 1
    els = []
    invertedMatrix[i] = [] as Partial<Row>
    divisor = newMatrix[i][i]
    for (let p = 0; p < np; p++) {
      new_element = newMatrix[i][p] / divisor
      els.push(new_element)
      // Shuffle off the current row of the right hand side into the results
      // array as it will not be modified by later runs through this loop
      if (p >= n) {
        invertedMatrix[i].push(new_element)
      }
    }
    newMatrix[i] = els as Row
    // Then, subtract this row from those above it to give the identity matrix
    // on the left hand side
    j = i
    while (j--) {
      els = []
      for (let p = 0; p < np; p++) {
        els.push(newMatrix[j][p] - newMatrix[i][p] * newMatrix[j][i])
      }
      newMatrix[j] = els as Row
    }
  }

  return invertedMatrix as Matrix
}
