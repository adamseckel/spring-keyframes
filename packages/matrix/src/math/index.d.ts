// Type definitions for sylvester-es6 0.0
// Project: https://github.com/pithumke/sylvester
// Definitions by: briwa <https://github.com/briwa>
//                 Stephane Alie <https://github.com/StephaneAlie>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// === Sylvester ===
// Vector and Matrix mathematics modules for JavaScript
// Copyright (c) 2007 James Coglan
// Extended version of the library is courtesy of @pithumke (c) 2016

export class Vector {
  /**
   * Constructor function.
   */
  constructor(elements: Vector | number[])

  static i: Vector
  static j: Vector
  static k: Vector

  /**
   * Random vector of size n.
   */
  static Random(n: number): Vector

  /**
   * Vector filled with zeros.
   */
  static Zero(n: number): Vector

  /**
   * Gets an array containing the vector's elements.
   */
  elements: number[]

  /**
   * Returns element i of the vector.
   */
  e(i: number): number

  /**
   * Returns the number of elements the vector has.
   */
  dimensions(): number

  /**
   * Returns the modulus ('length') of the vector.
   */
  modulus(): number

  /**
   * Returns true if the vector is equal to the argument.
   */
  eql(vector: Vector | number[]): boolean

  /**
   * Returns a copy of the vector.
   */
  dup(): Vector

  /**
   * Maps the vector to another vector according to the given function.
   */
  map(fn: (x: number, i: number) => any): Vector

  /**
   * Calls the iterator for each element of the vector in turn.
   */
  each(fn: (x: number, i: number) => any): void

  /**
   * Returns a new vector created by normalizing the receiver.
   */
  toUnitVector(): Vector

  /**
   * Returns the angle between the vector and the argument (also a vector).
   */
  angleFrom(vector: Vector): number

  /**
   * Returns true if the vector is parallel to the argument.
   */
  isParallelTo(vector: Vector): boolean

  /**
   * Returns true if the vector is antiparallel to the argument.
   */
  isAntiparallelTo(vector: Vector): boolean

  /**
   * Returns true iff the vector is perpendicular to the argument.
   */
  isPerpendicularTo(vector: Vector): boolean

  /**
   * Returns the result of adding the argument to the vector.
   */
  add(vector: Vector | number[]): Vector

  /**
   * Returns the result of subtracting the argument from the vector.
   */
  subtract(vector: Vector | number[]): Vector

  /**
   * Returns the result of multiplying the elements of the vector by the argument.
   */
  multiply(k: number): Vector

  /**
   * Returns the result of multiplying the elements of the vector by the argument (Alias for multiply(k)).
   */
  x(k: number): Vector

  /**
   * Returns the scalar product of the vector with the argument. Both vectors must have equal dimensionality.
   *
   * @param: {Vector|number[]} vector The other vector.
   */
  dot(vector: Vector | number[]): number

  /**
   * Returns the vector product of the vector with the argument. Both vectors must have dimensionality 3.
   */
  cross(vector: Vector | number[]): Vector

  /**
   * Returns the (absolute) largest element of the vector.
   */
  max(): number

  /**
   * Returns the index of the first match found.
   */
  indexOf(x: number): number

  /**
   * Returns a diagonal matrix with the vector's elements as its diagonal elements.
   */
  toDiagonalMatrix(): Matrix

  /**
   * Returns the result of rounding the elements of the vector.
   */
  round(): Vector

  /**
   * Returns a copy of the vector with elements set to the given value if they differ from
   * it by less than Sylvester.precision.
   */
  snapTo(x: number): Vector

  /**
   * Rotates the vector about the given object. The object should be a point if the vector is 2D,
   * and a line if it is 3D. Be careful with line directions!
   */
  rotate(t: number | Matrix, obj: Vector): Vector

  /**
   * Returns the result of reflecting the point in the given point, line or plane.
   */
  reflectionIn(obj: Vector): Vector

  /**
   * Utility to make sure vectors are 3D. If they are 2D, a zero z-component is added.
   */
  to3D(): Vector

  /**
   * Returns a string representation of the vector.
   */
  inspect(): string

  /**
   * Set vector's elements from an array.
   */
  setElements(els: Vector | number[]): Vector
}

export class Matrix {
  /**
   * Constructor function.
   */
  constructor(elements: number[] | number[][] | Vector | Matrix)

  /**
   * Identity matrix of size n.
   */
  static I(n: number): Matrix

  /**
   * Diagonal matrix - all off-diagonal elements are zero
   */
  static Diagonal(elements: number[] | number[][] | Vector | Matrix): Matrix

  /**
   * Rotation matrix about some axis. If no axis is supplied, assume we're after a 2D transform.
   */
  static Rotation(theta: number, a?: Vector): Matrix

  static RotationX(t: number): Matrix
  static RotationY(t: number): Matrix
  static RotationZ(t: number): Matrix

  /**
   * Random matrix of n rows, m columns.
   */
  static Random(n: number, m: number): Matrix

  /**
   * Matrix filled with zeros.
   */
  static Zero(n: number, m: number): Matrix

  /**
   * Gets a nested array containing the matrix's elements.
   */
  elements: number[][]

  /**
   * Returns element (i,j) of the matrix.
   */
  e(i: number, j: number): any

  /**
   * Returns row k of the matrix as a vector.
   */
  row(i: number): Vector

  /**
   * Returns column k of the matrix as a vector.
   */
  col(j: number): Vector

  /**
   * Returns the number of rows/columns the matrix has.
   */
  dimensions(): any

  /**
   * Returns the number of rows in the matrix.
   */
  rows(): number

  /**
   * Returns the number of columns in the matrix.
   */
  cols(): number

  /**
   * Returns true if the matrix is equal to the argument. You can supply a vector as the argument,
   * in which case the receiver must be a one-column matrix equal to the vector.
   */
  eql(matrix: Vector | Matrix | number[] | number[][]): boolean

  /**
   * Returns a copy of the matrix.
   */
  dup(): Matrix

  /**
   * Maps the matrix to another matrix (of the same dimensions) according to the given function.
   */
  map(fn: (x: number, i: number, j: number) => any): Matrix

  /**
   * Returns true iff the argument has the same dimensions as the matrix.
   */
  isSameSizeAs(matrix: Matrix): boolean

  /**
   * Returns the result of adding another matrix to the matrix.
   */
  add(matrix: Matrix): Matrix

  /**
   * Returns the result of adding a vector to the matrix.
   */
  add(vector: Vector): Vector

  /**
   * Returns the result of subtracting the argument from the matrix.
   */
  subtract(matrix: Matrix): Matrix

  /**
   * Returns true iff the matrix can multiply the argument from the left.
   */
  canMultiplyFromLeft(matrix: Matrix): boolean

  /**
   * Returns the result of multiplying the matrix from the right by the argument. If the argument is a scalar
   * then just multiply all the elements. If the argument is a vector, a vector is returned, which saves you
   * having to remember calling col(1) on the result.
   */
  multiply(matrix: number | Matrix): Matrix

  /**
   * Returns the result of multiplying the matrix from the right by the argument. If the argument is a scalar
   * then just multiply all the elements. If the argument is a vector, a vector is returned, which saves you
   * having to remember calling col(1) on the result.
   */
  multiply(vector: Vector): Vector

  x(matrix: number | Matrix): Matrix

  x(vector: Vector): Vector

  /**
   * Returns a submatrix taken from the matrix. Argument order is: start row, start col, nrows, ncols.
   * Element selection wraps if the required index is outside the matrix's bounds, so you could use
   * this to perform row/column cycling or copy-augmenting.
   */
  minor(a: number, b: number, c: number, d: number): Matrix

  /**
   * Returns the transpose of the matrix.
   */
  transpose(): Matrix

  /**
   * Returns true if the matrix is square.
   */
  isSquare(): boolean

  /**
   * Returns the (absolute) largest element of the matrix.
   */
  max(): number

  /**
   * Returns the indices of the first match found by reading row-by-row from left to right.
   */
  indexOf(x: number): any

  /**
   * If the matrix is square, returns the diagonal elements as a vector; otherwise, returns null.
   */
  diagonal(): Vector

  /**
   * Make the matrix upper (right) triangular by Gaussian elimination. This method only adds multiples
   * of rows to other rows. No rows are scaled up or switched, and the determinant is preserved.
   */
  toRightTriangular(): Matrix
  toUpperTriangular(): Matrix

  /**
   * Returns the determinant for square matrices.
   */
  determinant(): number
  det(): number

  /**
   * Returns true if the matrix is singular.
   */
  isSingular(): boolean

  /**
   * Returns the trace for square matrices.
   */
  trace(): number
  tr(): number

  /**
   * Returns the rank of the matrix.
   */
  rank(): number
  rk(): number

  /**
   * Returns the result of attaching the given argument to the right-hand side of the matrix.
   */
  augment(matrix: Vector | Matrix | number[] | number[][]): Matrix

  /**
   * Returns the inverse (if one exists) using Gauss-Jordan.
   */
  inverse(): Matrix
  inv(): Matrix

  /**
   * Returns the result of rounding all the elements.
   */
  round(): Matrix

  /**
   * Returns a copy of the matrix with elements set to the given value if they differ from it
   * by less than Sylvester.precision.
   */
  snapTo(x: number): Matrix

  /**
   * Returns a string representation of the matrix.
   */
  inspect(): string

  /**
   * Set the matrix's elements from an array. If the argument passed is a vector, the resulting matrix
   * will be a single column.
   */
  setElements(matrix: number[] | number[][] | Vector | Matrix): Matrix
}

/**
 * The level of the precision.
 */
export const PRECISION: number
