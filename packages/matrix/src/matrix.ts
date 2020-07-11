import { determinant, Matrix } from './math/matrix'
import { modulus, toUnitVector, dot, cross } from './math/vector'
// import { isolatePerspective } from './utils/isolatePerspective'

// Convert radians to degrees
function rad2deg(rad: number) {
  return rad * (180 / Math.PI)
}

function combine(a: any, b: any, ascl: any, bscl: any) {
  const result = []
  result[0] = ascl * a[0] + bscl * b[0]
  result[1] = ascl * a[1] + bscl * b[1]

  // Both vectors are 3d. Return a 3d vector
  if (a.length === 3 && b.length === 3) {
    result[2] = ascl * a[2] + bscl * b[2]
  }
  return result
}

export interface FromMatrix {
  perspective: any
  translateX: number
  translateY: number
  translateZ: number
  rotate: number
  rotateX: number
  rotateY: number
  rotateZ: number
  scaleX: number
  scaleY: number
  scaleZ: number
  skew: number
  skewX: number
  skewY: number
}

// Return a transform object if matrix can be decomposed, null if it can't
function decompose(matrix: Matrix): FromMatrix | null {
  const transform = {} as any

  // Normalize the matrix
  if (matrix[3][3] === 0) {
    return null
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i][j] /= matrix[3][3]
    }
  }

  // perspectiveMatrix is used to solve for perspective, but it also provides
  // an easy way to test for singularity of the upper 3x3 component
  const perspectiveMatrix = matrix

  for (let i = 0; i < 3; i++) {
    perspectiveMatrix[i][3] = 0
  }

  perspectiveMatrix[3][3] = 1

  if (determinant(perspectiveMatrix) === 0) {
    return null
  }

  // First, isolate perspective
  let perspective
  if (matrix[0][3] !== 0 || matrix[1][3] !== 0 || matrix[2][3] !== 0) {
    // Apparently unnecessary
    throw new Error('Needs to isolate perspective...')
    // perspective = isolatePerspective(matrix, perspectiveMatrix)

    // Clear the perspective partition
    // matrix[0][3] = matrix[1][3] = matrix[2][3] = 0
    // matrix[3][3] = 1
  } else {
    // No perspective
    perspective = []
    perspective[0] = perspective[1] = perspective[2] = 0
    perspective[3] = 1
  }

  // Next take care of translation
  const translateX = matrix[3][0]
  const translateY = matrix[3][1]
  const translateZ = matrix[3][2]

  // Now get scale and shear
  // row is a 3 element array of 3 component vectors
  const row = [[], [], []] as any

  for (let i = 0; i < 3; i++) {
    row[i][0] = matrix[i][0]
    row[i][1] = matrix[i][1]
    row[i][2] = matrix[i][2]
  }

  // Compute X scale factor and normalize first row
  let scaleX = modulus(row[0])
  row[0] = toUnitVector(row[0])

  // Compute XY shear factor and make 2nd row orthogonal to 1st
  let skew = dot(row[0], row[1])
  row[1] = combine(row[1], row[0], 1.0, -skew)

  // Now, compute Y scale and normalize 2nd row
  const scaleY = modulus(row[1])
  row[1] = toUnitVector(row[1])
  skew /= scaleY

  // Compute XZ and YZ shears, orthogonalize 3rd row
  let skewX = dot(row[0], row[2])
  row[2] = combine(row[2], row[0], 1.0, -skewX)
  let skewY = dot(row[1], row[2])
  row[2] = combine(row[2], row[1], 1.0, -skewY)

  // Next, get Z scale and normalize 3rd row
  const scaleZ = modulus(row[2])
  row[2] = toUnitVector(row[2])
  skewX /= scaleZ
  skewY /= scaleZ

  // At this point, the matrix (in rows) is orthonormal. Check for a
  // coordinate system flip. If the determinant is -1, then negate the
  // matrix and the scaling factors

  const pdum3 = cross(row[1], row[2])
  if (dot(row[0], pdum3) < 0) {
    for (let i = 0; i < 3; i++) {
      scaleX *= -1
      row[i][0] *= -1
      row[i][1] *= -1
      row[i][2] *= -1
    }
  }

  // Get the rotations
  const rotateY = Math.asin(-row[0][2])
  let rotateX, rotateZ
  if (Math.cos(transform.rotateY) !== 0) {
    rotateX = Math.atan2(row[1][2], row[2][2])
    rotateZ = Math.atan2(row[0][1], row[0][0])
  } else {
    rotateX = Math.atan2(-row[2][0], row[1][1])
    rotateZ = 0
  }

  return {
    perspective,
    translateX,
    translateY,
    translateZ,
    rotate: rad2deg(rotateZ),
    rotateX: rad2deg(rotateX),
    rotateY: rad2deg(rotateY),
    rotateZ: rad2deg(rotateZ),
    scaleX,
    scaleY,
    scaleZ,
    skew: rad2deg(skew),
    skewX: rad2deg(skewX),
    skewY: rad2deg(skewY),
  }
}

// Returns an object with transform properties
export function fromMatrix(transform: string): FromMatrix | null {
  // Check if transform is 3d
  const is3d = transform.includes('matrix3d')

  // Convert matrix values to an array of floats
  const split = transform.match(/\((.+)\)/)
  if (!split) return null
  const t = split[1].split(',').map((value: string) => parseFloat(value))

  // Convert transform to a matrix. Matrix columns become arrays
  const matrix: Matrix = is3d
    ? [
        // Create 4x4 3d matrix
        [t[0], t[1], t[2], t[3]],
        [t[4], t[5], t[6], t[7]],
        [t[8], t[9], t[10], t[11]],
        [t[12], t[13], t[14], t[15]],
      ]
    : [
        // Create 4x4 2d matrix
        [t[0], t[1], 0, 0],
        [t[2], t[3], 0, 0],
        [0, 0, 1, 0],
        [t[4], t[5], 0, 1],
      ]

  return decompose(matrix)
}
