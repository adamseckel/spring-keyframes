'use strict'
export class Vector {
  constructor(elements) {
    this.elements = (elements.elements || elements).slice()
  }

  e(i) {
    return i < 1 || i > this.elements.length ? null : this.elements[i - 1]
  }

  modulus() {
    return Math.sqrt(this.dot(this))
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

  toUnitVector() {
    var r = this.modulus()
    if (r === 0) {
      return this.dup()
    }
    return this.map(function(x) {
      return x / r
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
}

Vector.prototype.x = Vector.prototype.multiply
Vector.prototype.each = Vector.prototype.forEach
