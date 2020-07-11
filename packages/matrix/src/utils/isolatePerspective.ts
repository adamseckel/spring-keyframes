// Not sure what shape rightHandSide is supposed to take...

// import {inverse, transpose, multiply, Matrix } from '../ts/matrix'

// export function isolatePerspective(matrix: Matrix, perspectiveMatrix: Matrix) {
//   // rightHandSide is the right hand side of the equation
//   const rightHandSide = [matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]]

//   // Solve the equation by inverting perspectiveMatrix and multiplying
//   // rightHandSide by the inverse
//   const perspectiveMatrixInverse = inverse(perspectiveMatrix)
//   const perspectiveMatrixInverseTranspose = perspectiveMatrixInverse
//     ? transpose(perspectiveMatrixInverse)
//     : null
//   const perspective = perspectiveMatrixInverseTranspose
//     ? multiply(perspectiveMatrixInverseTranspose, rightHandSide)
//     : null

//   return perspective
// }
