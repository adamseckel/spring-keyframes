'use strict'

import { Vector } from './Vector'
const PRECISION = 1e-6
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

  row(i) {
    if (i > this.elements.length) {
      return null
    }
    return new Vector(this.elements[i - 1])
  }

  col(j) {
    if (this.elements.length === 0) {
      return null
    }
    if (j > this.elements[0].length) {
      return null
    }
    var col = [],
      n = this.elements.length
    for (var i = 0; i < n; i++) {
      col.push(this.elements[i][j - 1])
    }
    return new Vector(col)
  }

  dimensions() {
    var cols = this.elements.length === 0 ? 0 : this.elements[0].length
    return { rows: this.elements.length, cols: cols }
  }

  rows() {
    return this.elements.length
  }

  cols() {
    if (this.elements.length === 0) {
      return 0
    }
    return this.elements[0].length
  }

  eql(matrix) {
    var M = matrix.elements || matrix
    if (!M[0] || typeof M[0][0] === 'undefined') {
      M = new Matrix(M).elements
    }
    if (this.elements.length === 0 || M.length === 0) {
      return this.elements.length === M.length
    }
    if (this.elements.length !== M.length) {
      return false
    }
    if (this.elements[0].length !== M[0].length) {
      return false
    }
    var i = this.elements.length,
      nj = this.elements[0].length,
      j
    while (i--) {
      j = nj
      while (j--) {
        if (Math.abs(this.elements[i][j] - M[i][j]) > PRECISION) {
          return false
        }
      }
    }
    return true
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

  diagonal() {
    if (!this.isSquare) {
      return null
    }
    var els = [],
      n = this.elements.length
    for (var i = 0; i < n; i++) {
      els.push(this.elements[i][i])
    }
    return new Vector(els)
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

  rank() {
    if (this.elements.length === 0) {
      return 0
    }
    var M = this.toRightTriangular(),
      rank = 0
    var i = this.elements.length,
      nj = this.elements[0].length,
      j
    while (i--) {
      j = nj
      while (j--) {
        if (Math.abs(M.elements[i][j]) > PRECISION) {
          rank++
          break
        }
      }
    }
    return rank
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

  round() {
    return this.map(function(x) {
      return Math.round(x)
    })
  }

  snapTo(x) {
    return this.map(function(p) {
      return Math.abs(p - x) <= PRECISION ? x : p
    })
  }

  inspect() {
    var matrix_rows = []
    var n = this.elements.length
    if (n === 0) return '[]'
    for (var i = 0; i < n; i++) {
      matrix_rows.push(new Vector(this.elements[i]).inspect())
    }
    return matrix_rows.join('\n')
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

  //From glUtils.js
  flatten() {
    var result = []
    if (this.elements.length == 0) {
      return []
    }

    for (var j = 0; j < this.elements[0].length; j++) {
      for (var i = 0; i < this.elements.length; i++) {
        result.push(this.elements[i][j])
      }
    }
    return result
  }

  //From glUtils.js
  ensure4x4() {
    if (this.elements.length == 4 && this.elements[0].length == 4) {
      return this
    }

    if (this.elements.length > 4 || this.elements[0].length > 4) {
      return null
    }

    for (var i = 0; i < this.elements.length; i++) {
      for (var j = this.elements[i].length; j < 4; j++) {
        if (i == j) {
          this.elements[i].push(1)
        } else {
          this.elements[i].push(0)
        }
      }
    }

    for (var i = this.elements.length; i < 4; i++) {
      if (i == 0) {
        this.elements.push([1, 0, 0, 0])
      } else if (i == 1) {
        this.elements.push([0, 1, 0, 0])
      } else if (i == 2) {
        this.elements.push([0, 0, 1, 0])
      } else if (i == 3) {
        this.elements.push([0, 0, 0, 1])
      }
    }

    return this
  }

  //From glUtils.js
  make3x3() {
    if (this.elements.length != 4 || this.elements[0].length != 4) {
      return null
    }

    return new Matrix([
      [this.elements[0][0], this.elements[0][1], this.elements[0][2]],
      [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
      [this.elements[2][0], this.elements[2][1], this.elements[2][2]],
    ])
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

Matrix.Diagonal = function(elements) {
  var i = elements.length
  var M = Matrix.I(i)
  while (i--) {
    M.elements[i][i] = elements[i]
  }
  return M
}

Matrix.Rotation = function(theta, a) {
  if (!a) {
    return new Matrix([
      [Math.cos(theta), -Math.sin(theta)],
      [Math.sin(theta), Math.cos(theta)],
    ])
  }
  var axis = a.dup()
  if (axis.elements.length !== 3) {
    return null
  }
  var mod = axis.modulus()
  var x = axis.elements[0] / mod,
    y = axis.elements[1] / mod,
    z = axis.elements[2] / mod
  var s = Math.sin(theta),
    c = Math.cos(theta),
    t = 1 - c
  // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
  // That proof rotates the co-ordinate system so theta becomes -theta and sin
  // becomes -sin here.
  return new Matrix([
    [t * x * x + c, t * x * y - s * z, t * x * z + s * y],
    [t * x * y + s * z, t * y * y + c, t * y * z - s * x],
    [t * x * z - s * y, t * y * z + s * x, t * z * z + c],
  ])
}

Matrix.RotationX = function(t) {
  var c = Math.cos(t),
    s = Math.sin(t)
  return new Matrix([[1, 0, 0], [0, c, -s], [0, s, c]])
}
Matrix.RotationY = function(t) {
  var c = Math.cos(t),
    s = Math.sin(t)
  return new Matrix([[c, 0, s], [0, 1, 0], [-s, 0, c]])
}
Matrix.RotationZ = function(t) {
  var c = Math.cos(t),
    s = Math.sin(t)
  return new Matrix([[c, -s, 0], [s, c, 0], [0, 0, 1]])
}

Matrix.Random = function(n, m) {
  return Matrix.Zero(n, m).map(function() {
    return Math.random()
  })
}

//From glUtils.js
Matrix.Translation = function(v) {
  if (v.elements.length == 2) {
    var r = Matrix.I(3)
    r.elements[2][0] = v.elements[0]
    r.elements[2][1] = v.elements[1]
    return r
  }

  if (v.elements.length == 3) {
    var r = Matrix.I(4)
    r.elements[0][3] = v.elements[0]
    r.elements[1][3] = v.elements[1]
    r.elements[2][3] = v.elements[2]
    return r
  }

  throw 'Invalid length for Translation'
}

Matrix.Zero = function(n, m) {
  var els = [],
    i = n,
    j
  while (i--) {
    j = m
    els[i] = []
    while (j--) {
      els[i][j] = 0
    }
  }
  return new Matrix(els)
}

Matrix.prototype.toUpperTriangular = Matrix.prototype.toRightTriangular
Matrix.prototype.det = Matrix.prototype.determinant
Matrix.prototype.tr = Matrix.prototype.trace
Matrix.prototype.rk = Matrix.prototype.rank
Matrix.prototype.inv = Matrix.prototype.inverse
Matrix.prototype.x = Matrix.prototype.multiply
