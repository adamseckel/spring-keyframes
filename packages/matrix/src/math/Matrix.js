'use strict'
export class Matrix {
  constructor(elements) {
    this.setElements(elements)
  }

  e(i, j) {
    if (
      i < 1 ||
      i > this.elements.length ||
      j < 1 ||
      j > this.elements[0].length
    ) {
      return null
    }
    return this.elements[i - 1][j - 1]
  }

  dup() {
    return new Matrix(this.elements)
  }

  map(fn, context) {
    if (this.elements.length === 0) {
      return new Matrix([])
    }
    var els = [],
      i = this.elements.length,
      nj = this.elements[0].length,
      j
    while (i--) {
      j = nj
      els[i] = []
      while (j--) {
        els[i][j] = fn.call(context, this.elements[i][j], i + 1, j + 1)
      }
    }
    return new Matrix(els)
  }

  isSameSizeAs(matrix) {
    var M = matrix.elements || matrix
    if (typeof M[0][0] === 'undefined') {
      M = new Matrix(M).elements
    }
    if (this.elements.length === 0) {
      return M.length === 0
    }
    return (
      this.elements.length === M.length &&
      this.elements[0].length === M[0].length
    )
  }

  add(matrix) {
    if (this.elements.length === 0) {
      return this.map(function(x) {
        return x
      })
    }
    var M = matrix.elements || matrix
    if (typeof M[0][0] === 'undefined') {
      M = new Matrix(M).elements
    }
    if (!this.isSameSizeAs(M)) {
      return null
    }
    return this.map(function(x, i, j) {
      return x + M[i - 1][j - 1]
    })
  }

  subtract(matrix) {
    if (this.elements.length === 0) {
      return this.map(function(x) {
        return x
      })
    }
    var M = matrix.elements || matrix
    if (typeof M[0][0] === 'undefined') {
      M = new Matrix(M).elements
    }
    if (!this.isSameSizeAs(M)) {
      return null
    }
    return this.map(function(x, i, j) {
      return x - M[i - 1][j - 1]
    })
  }

  canMultiplyFromLeft(matrix) {
    if (this.elements.length === 0) {
      return false
    }
    var M = matrix.elements || matrix
    if (typeof M[0][0] === 'undefined') {
      M = new Matrix(M).elements
    }
    // this.columns should equal matrix.rows
    return this.elements[0].length === M.length
  }

  multiply(matrix) {
    if (this.elements.length === 0) {
      return null
    }
    if (!matrix.elements) {
      return this.map(function(x) {
        return x * matrix
      })
    }
    var returnVector = matrix.modulus ? true : false
    var M = matrix.elements || matrix
    if (typeof M[0][0] === 'undefined') {
      M = new Matrix(M).elements
    }
    if (!this.canMultiplyFromLeft(M)) {
      return null
    }
    var i = this.elements.length,
      nj = M[0].length,
      j
    var cols = this.elements[0].length,
      c,
      elements = [],
      sum
    while (i--) {
      j = nj
      elements[i] = []
      while (j--) {
        c = cols
        sum = 0
        while (c--) {
          sum += this.elements[i][c] * M[c][j]
        }
        elements[i][j] = sum
      }
    }
    var M = new Matrix(elements)
    return returnVector ? M.col(1) : M
  }

  minor(a, b, c, d) {
    if (this.elements.length === 0) {
      return null
    }
    var elements = [],
      ni = c,
      i,
      nj,
      j
    var rows = this.elements.length,
      cols = this.elements[0].length
    while (ni--) {
      i = c - ni - 1
      elements[i] = []
      nj = d
      while (nj--) {
        j = d - nj - 1
        elements[i][j] = this.elements[(a + i - 1) % rows][(b + j - 1) % cols]
      }
    }
    return new Matrix(elements)
  }

  transpose() {
    if (this.elements.length === 0) {
      return new Matrix([])
    }
    var rows = this.elements.length,
      i,
      cols = this.elements[0].length,
      j
    var elements = [],
      i = cols
    while (i--) {
      j = rows
      elements[i] = []
      while (j--) {
        elements[i][j] = this.elements[j][i]
      }
    }
    return new Matrix(elements)
  }

  isSquare() {
    var cols = this.elements.length === 0 ? 0 : this.elements[0].length
    return this.elements.length === cols
  }

  max() {
    if (this.elements.length === 0) {
      return null
    }
    var m = 0,
      i = this.elements.length,
      nj = this.elements[0].length,
      j
    while (i--) {
      j = nj
      while (j--) {
        if (Math.abs(this.elements[i][j]) > Math.abs(m)) {
          m = this.elements[i][j]
        }
      }
    }
    return m
  }

  indexOf(x) {
    if (this.elements.length === 0) {
      return null
    }
    var index = null,
      ni = this.elements.length,
      i,
      nj = this.elements[0].length,
      j
    for (i = 0; i < ni; i++) {
      for (j = 0; j < nj; j++) {
        if (this.elements[i][j] === x) {
          return {
            i: i + 1,
            j: j + 1,
          }
        }
      }
    }
    return null
  }

  toRightTriangular() {
    if (this.elements.length === 0) {
      return new Matrix([])
    }
    var M = this.dup(),
      els
    var n = this.elements.length,
      i,
      j,
      np = this.elements[0].length,
      p
    for (i = 0; i < n; i++) {
      if (M.elements[i][i] === 0) {
        for (j = i + 1; j < n; j++) {
          if (M.elements[j][i] !== 0) {
            els = []
            for (p = 0; p < np; p++) {
              els.push(M.elements[i][p] + M.elements[j][p])
            }
            M.elements[i] = els
            break
          }
        }
      }
      if (M.elements[i][i] !== 0) {
        for (j = i + 1; j < n; j++) {
          var multiplier = M.elements[j][i] / M.elements[i][i]
          els = []
          for (p = 0; p < np; p++) {
            // Elements with column numbers up to an including the number of the
            // row that we're subtracting can safely be set straight to zero,
            // since that's the point of this routine and it avoids having to
            // loop over and correct rounding errors later
            els.push(
              p <= i ? 0 : M.elements[j][p] - M.elements[i][p] * multiplier
            )
          }
          M.elements[j] = els
        }
      }
    }
    return M
  }

  determinant() {
    if (this.elements.length === 0) {
      return 1
    }
    if (!this.isSquare()) {
      return null
    }
    var M = this.toRightTriangular()
    var det = M.elements[0][0],
      n = M.elements.length
    for (var i = 1; i < n; i++) {
      det = det * M.elements[i][i]
    }
    return det
  }

  isSingular() {
    return this.isSquare() && this.determinant() === 0
  }

  trace() {
    if (this.elements.length === 0) {
      return 0
    }
    if (!this.isSquare()) {
      return null
    }
    var tr = this.elements[0][0],
      n = this.elements.length
    for (var i = 1; i < n; i++) {
      tr += this.elements[i][i]
    }
    return tr
  }

  augment(matrix) {
    if (this.elements.length === 0) {
      return this.dup()
    }
    var M = matrix.elements || matrix
    if (typeof M[0][0] === 'undefined') {
      M = new Matrix(M).elements
    }
    var T = this.dup(),
      cols = T.elements[0].length
    var i = T.elements.length,
      nj = M[0].length,
      j
    if (i !== M.length) {
      return null
    }
    while (i--) {
      j = nj
      while (j--) {
        T.elements[i][cols + j] = M[i][j]
      }
    }
    return T
  }

  inverse() {
    if (this.elements.length === 0) {
      return null
    }
    if (!this.isSquare() || this.isSingular()) {
      return null
    }
    var n = this.elements.length,
      i = n,
      j
    var M = this.augment(Matrix.I(n)).toRightTriangular()
    var np = M.elements[0].length,
      p,
      els,
      divisor
    var inverse_elements = [],
      new_element
    // Matrix is non-singular so there will be no zeros on the
    // diagonal. Cycle through rows from last to first.
    while (i--) {
      // First, normalise diagonal elements to 1
      els = []
      inverse_elements[i] = []
      divisor = M.elements[i][i]
      for (p = 0; p < np; p++) {
        new_element = M.elements[i][p] / divisor
        els.push(new_element)
        // Shuffle off the current row of the right hand side into the results
        // array as it will not be modified by later runs through this loop
        if (p >= n) {
          inverse_elements[i].push(new_element)
        }
      }
      M.elements[i] = els
      // Then, subtract this row from those above it to give the identity matrix
      // on the left hand side
      j = i
      while (j--) {
        els = []
        for (p = 0; p < np; p++) {
          els.push(M.elements[j][p] - M.elements[i][p] * M.elements[j][i])
        }
        M.elements[j] = els
      }
    }
    return new Matrix(inverse_elements)
  }

  setElements(els) {
    var i,
      j,
      elements = els.elements || els
    if (elements[0] && typeof elements[0][0] !== 'undefined') {
      i = elements.length
      this.elements = []
      while (i--) {
        j = elements[i].length
        this.elements[i] = []
        while (j--) {
          this.elements[i][j] = elements[i][j]
        }
      }
      return this
    }
    var n = elements.length
    this.elements = []
    for (i = 0; i < n; i++) {
      this.elements.push([elements[i]])
    }
    return this
  }
}

Matrix.I = function(n) {
  var els = [],
    i = n,
    j
  while (i--) {
    j = n
    els[i] = []
    while (j--) {
      els[i][j] = i === j ? 1 : 0
    }
  }
  return new Matrix(els)
}

Matrix.prototype.toUpperTriangular = Matrix.prototype.toRightTriangular
Matrix.prototype.det = Matrix.prototype.determinant
Matrix.prototype.tr = Matrix.prototype.trace
Matrix.prototype.inv = Matrix.prototype.inverse
Matrix.prototype.x = Matrix.prototype.multiply
