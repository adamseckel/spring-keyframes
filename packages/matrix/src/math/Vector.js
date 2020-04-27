'use strict'

import { Matrix } from './Matrix'
const PRECISION = 1e-6
export class Vector {
  constructor(elements) {
    this.setElements(elements)
  }

  e(i) {
    return i < 1 || i > this.elements.length ? null : this.elements[i - 1]
  }

  dimensions() {
    return this.elements.length
  }

  modulus() {
    return Math.sqrt(this.dot(this))
  }

  eql(vector) {
    var n = this.elements.length
    var V = vector.elements || vector
    if (n !== V.length) {
      return false
    }
    while (n--) {
      if (Math.abs(this.elements[n] - V[n]) > PRECISION) {
        return false
      }
    }
    return true
  }

  dup() {
    return new Vector(this.elements)
  }

  map(fn, context) {
    var elements = []
    this.each(function(x, i) {
      elements.push(fn.call(context, x, i))
    })
    return new Vector(elements)
  }

  forEach(fn, context) {
    var n = this.elements.length
    for (var i = 0; i < n; i++) {
      fn.call(context, this.elements[i], i + 1)
    }
  }

  toUnitVector() {
    var r = this.modulus()
    if (r === 0) {
      return this.dup()
    }
    return this.map(function(x) {
      return x / r
    })
  }

  angleFrom(vector) {
    var V = vector.elements || vector
    var n = this.elements.length,
      k = n,
      i
    if (n !== V.length) {
      return null
    }
    var dot = 0,
      mod1 = 0,
      mod2 = 0
    // Work things out in parallel to save time
    this.each(function(x, i) {
      dot += x * V[i - 1]
      mod1 += x * x
      mod2 += V[i - 1] * V[i - 1]
    })
    mod1 = Math.sqrt(mod1)
    mod2 = Math.sqrt(mod2)
    if (mod1 * mod2 === 0) {
      return null
    }
    var theta = dot / (mod1 * mod2)
    if (theta < -1) {
      theta = -1
    }
    if (theta > 1) {
      theta = 1
    }
    return Math.acos(theta)
  }

  isParallelTo(vector) {
    var angle = this.angleFrom(vector)
    return angle === null ? null : angle <= PRECISION
  }

  isAntiparallelTo(vector) {
    var angle = this.angleFrom(vector)
    return angle === null ? null : Math.abs(angle - Math.PI) <= PRECISION
  }

  isPerpendicularTo(vector) {
    var dot = this.dot(vector)
    return dot === null ? null : Math.abs(dot) <= PRECISION
  }

  add(vector) {
    var V = vector.elements || vector
    if (this.elements.length !== V.length) {
      return null
    }
    return this.map(function(x, i) {
      return x + V[i - 1]
    })
  }

  subtract(vector) {
    var V = vector.elements || vector
    if (this.elements.length !== V.length) {
      return null
    }
    return this.map(function(x, i) {
      return x - V[i - 1]
    })
  }

  multiply(k) {
    return this.map(function(x) {
      return x * k
    })
  }

  dot(vector) {
    var V = vector.elements || vector
    var i,
      product = 0,
      n = this.elements.length
    if (n !== V.length) {
      return null
    }
    while (n--) {
      product += this.elements[n] * V[n]
    }
    return product
  }

  cross(vector) {
    var B = vector.elements || vector
    if (this.elements.length !== 3 || B.length !== 3) {
      return null
    }
    var A = this.elements
    return new Vector([
      A[1] * B[2] - A[2] * B[1],
      A[2] * B[0] - A[0] * B[2],
      A[0] * B[1] - A[1] * B[0],
    ])
  }

  max() {
    var m = 0,
      i = this.elements.length
    while (i--) {
      if (Math.abs(this.elements[i]) > Math.abs(m)) {
        m = this.elements[i]
      }
    }
    return m
  }

  indexOf(x) {
    var index = null,
      n = this.elements.length
    for (var i = 0; i < n; i++) {
      if (index === null && this.elements[i] === x) {
        index = i + 1
      }
    }
    return index
  }

  toDiagonalMatrix() {
    return Matrix.Diagonal(this.elements)
  }

  round() {
    return this.map(function(x) {
      return Math.round(x)
    })
  }

  snapTo(x) {
    return this.map(function(y) {
      return Math.abs(y - x) <= PRECISION ? x : y
    })
  }

  rotate(t, obj) {
    var V,
      R = null,
      x,
      y,
      z
    if (t.determinant) {
      R = t.elements
    }
    switch (this.elements.length) {
      case 2: {
        V = obj.elements || obj
        if (V.length !== 2) {
          return null
        }
        if (!R) {
          R = Matrix.Rotation(t).elements
        }
        x = this.elements[0] - V[0]
        y = this.elements[1] - V[1]
        return new Vector([
          V[0] + R[0][0] * x + R[0][1] * y,
          V[1] + R[1][0] * x + R[1][1] * y,
        ])
        break
      }
      case 3: {
        if (!obj.direction) {
          return null
        }
        var C = obj.pointClosestTo(this).elements
        if (!R) {
          R = Matrix.Rotation(t, obj.direction).elements
        }
        x = this.elements[0] - C[0]
        y = this.elements[1] - C[1]
        z = this.elements[2] - C[2]
        return new Vector([
          C[0] + R[0][0] * x + R[0][1] * y + R[0][2] * z,
          C[1] + R[1][0] * x + R[1][1] * y + R[1][2] * z,
          C[2] + R[2][0] * x + R[2][1] * y + R[2][2] * z,
        ])
        break
      }
      default: {
        return null
      }
    }
  }

  reflectionIn(obj) {
    if (obj.anchor) {
      // obj is a plane or line
      var P = this.elements.slice()
      var C = obj.pointClosestTo(P).elements
      return new Vector([
        C[0] + (C[0] - P[0]),
        C[1] + (C[1] - P[1]),
        C[2] + (C[2] - (P[2] || 0)),
      ])
    } else {
      // obj is a point
      var Q = obj.elements || obj
      if (this.elements.length !== Q.length) {
        return null
      }
      return this.map(function(x, i) {
        return Q[i - 1] + (Q[i - 1] - x)
      })
    }
  }

  to3D() {
    var V = this.dup()
    switch (V.elements.length) {
      case 3: {
        break
      }
      case 2: {
        V.elements.push(0)
        break
      }
      default: {
        return null
      }
    }
    return V
  }

  inspect() {
    return '[' + this.elements.join(', ') + ']'
  }

  setElements(els) {
    this.elements = (els.elements || els).slice()
    return this
  }

  //From glUtils.js
  flatten() {
    return this.elements
  }
}

Vector.Random = function(n) {
  var elements = []
  while (n--) {
    elements.push(Math.random())
  }
  return new Vector(elements)
}

Vector.Zero = function(n) {
  var elements = []
  while (n--) {
    elements.push(0)
  }
  return new Vector(elements)
}

Vector.prototype.x = Vector.prototype.multiply
Vector.prototype.each = Vector.prototype.forEach

Vector.i = new Vector([1, 0, 0])
Vector.j = new Vector([0, 1, 0])
Vector.k = new Vector([0, 0, 1])
