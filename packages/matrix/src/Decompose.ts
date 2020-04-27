import { Matrix, Vector } from './math'

export class Decompose {
  // Convert radians to degrees
  rad2deg(rad: any) {
    return rad * (180 / Math.PI)
  }

  // Determinant of a matrix
  determinant(matrix: any) {
    return new Matrix(matrix).determinant()
  }

  // Inverse of a matrix
  inverse(matrix: any) {
    return new Matrix(matrix).inverse().elements
  }

  // Transpose of a matrix
  transpose(matrix: any) {
    return new Matrix(matrix).transpose().elements
  }

  // Multiply a point by a matrix and return the transformed point
  multVecMatrix(point: any, matrix: any) {
    return new Matrix(matrix).multiply(point).elements
  }

  // Get the length of a vector
  length(point: any) {
    return new Vector(point).modulus()
  }

  // Normalize the length of a point to 1
  normalize(point: any) {
    return new Vector(point).toUnitVector().elements
  }

  // Dot product of two points
  dot(point1: any, point2: any) {
    return new Vector(point1).dot(point2)
  }

  // Cross product of two points
  cross(point1: any, point2: any) {
    return new Vector(point1).cross(point2).elements
  }

  // TODO: Explain this function
  combine(a: any, b: any, ascl: any, bscl: any) {
    let result = []
    result[0] = ascl * a[0] + bscl * b[0]
    result[1] = ascl * a[1] + bscl * b[1]
    // Both vectors are 3d. Return a 3d vector
    if (a.length === 3 && b.length === 3) {
      result[2] = ascl * a[2] + bscl * b[2]
    }
    return result
  }

  // Return a transform object if matrix can be decomposed, null if it can't
  decompose(matrix: any) {
    let transform = {} as any

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
    let perspectiveMatrix = matrix

    for (let i = 0; i < 3; i++) {
      perspectiveMatrix[i][3] = 0
    }

    perspectiveMatrix[3][3] = 1

    if (this.determinant(perspectiveMatrix) === 0) {
      return null
    }

    // First, isolate perspective
    let perspective
    if (matrix[0][3] !== 0 || matrix[1][3] !== 0 || matrix[2][3] !== 0) {
      // rightHandSide is the right hand side of the equation
      let rightHandSide = []
      rightHandSide[0] = matrix[0][3]
      rightHandSide[1] = matrix[1][3]
      rightHandSide[2] = matrix[2][3]
      rightHandSide[3] = matrix[3][3]

      // Solve the equation by inverting perspectiveMatrix and multiplying
      // rightHandSide by the inverse
      let perspectiveMatrixInverse = this.inverse(perspectiveMatrix)
      let perspectiveMatrixInverseTranspose = this.transpose(
        perspectiveMatrixInverse
      )
      perspective = this.multVecMatrix(
        rightHandSide,
        perspectiveMatrixInverseTranspose
      )

      // Clear the perspective partition
      matrix[0][3] = matrix[1][3] = matrix[2][3] = 0
      matrix[3][3] = 1
    } else {
      // No perspective
      perspective = []
      perspective[0] = perspective[1] = perspective[2] = 0
      perspective[3] = 1
    }

    // Next take care of translation
    let translateX = matrix[3][0]
    let translateY = matrix[3][1]
    let translateZ = matrix[3][2]

    // Now get scale and shear
    // row is a 3 element array of 3 component vectors
    let row = [[], [], []] as any

    for (let i = 0; i < 3; i++) {
      row[i][0] = matrix[i][0]
      row[i][1] = matrix[i][1]
      row[i][2] = matrix[i][2]
    }

    // Compute X scale factor and normalize first row
    let scaleX = this.length(row[0])
    row[0] = this.normalize(row[0])

    // Compute XY shear factor and make 2nd row orthogonal to 1st
    let skew = this.dot(row[0], row[1])
    row[1] = this.combine(row[1], row[0], 1.0, -skew)

    // Now, compute Y scale and normalize 2nd row
    let scaleY = this.length(row[1])
    row[1] = this.normalize(row[1])
    skew /= scaleY

    // Compute XZ and YZ shears, orthogonalize 3rd row
    let skewX = this.dot(row[0], row[2])
    row[2] = this.combine(row[2], row[0], 1.0, -skewX)
    let skewY = this.dot(row[1], row[2])
    row[2] = this.combine(row[2], row[1], 1.0, -skewY)

    // Next, get Z scale and normalize 3rd row
    let scaleZ = this.length(row[2])
    row[2] = this.normalize(row[2])
    skewX /= scaleZ
    skewY /= scaleZ

    // At this point, the matrix (in rows) is orthonormal. Check for a
    // coordinate system flip. If the determinant is -1, then negate the
    // matrix and the scaling factors
    let pdum3 = this.cross(row[1], row[2])
    if (this.dot(row[0], pdum3) < 0) {
      for (let i = 0; i < 3; i++) {
        scaleX *= -1
        row[i][0] *= -1
        row[i][1] *= -1
        row[i][2] *= -1
      }
    }

    // Get the rotations
    let rotateY = Math.asin(-row[0][2])
    let rotateX, rotateZ
    if (Math.cos(transform.rotateY) !== 0) {
      rotateX = Math.atan2(row[1][2], row[2][2])
      rotateZ = Math.atan2(row[0][1], row[0][0])
    } else {
      rotateX = Math.atan2(-row[2][0], row[1][1])
      rotateZ = 0
    }

    return {
      perspective: perspective,
      translateX: translateX,
      translateY: translateY,
      translateZ: translateZ,
      rotate: this.rad2deg(rotateZ),
      rotateX: this.rad2deg(rotateX),
      rotateY: this.rad2deg(rotateY),
      rotateZ: this.rad2deg(rotateZ),
      scaleX: scaleX,
      scaleY: scaleY,
      scaleZ: scaleZ,
      skew: this.rad2deg(skew),
      skewX: this.rad2deg(skewX),
      skewY: this.rad2deg(skewY),
    }
  }

  // Returns an object with transform properties
  getTransform(computedStyle: CSSStyleDeclaration) {
    if (!computedStyle) return null

    // Check if element has transforms
    if (!('transform' in computedStyle) || computedStyle.transform === 'none') {
      return null
    }

    let transform = computedStyle.transform as any
    // Check if transform is 3d
    let is3d = transform.includes('matrix3d')

    // Convert matrix values to an array of floats
    transform = transform.match(/\((.+)\)/)[1]
    transform = transform.split(',') as string[]
    let t = transform.map((value: string) => parseFloat(value))

    // Convert transform to a matrix. Matrix columns become arrays
    let matrix = is3d
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

    return this.decompose(matrix)
  }
}
