export class Matrix {
  constructor(matrix: number[]) {
    if (matrix) this.value = matrix
  }

  private value: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

  // rotate
  rotate3d = (x: number = 0, y: number = 0, z: number = 0, deg: number = 0) => {
    const matrix = this.value
    const agl = (Math.PI * deg) / 180
    const numSqrt = Math.sqrt(x * x + y * y + z * z)
    const cos = Math.cos(agl)
    const sin = Math.sin(agl)
    const ux = x / numSqrt
    const uy = y / numSqrt
    const uz = z / numSqrt
    const negative = 1 - cos

    const r0 = ux * ux * negative + cos,
      r1 = ux * uy * negative + uz * sin,
      r2 = ux * uz * negative - uy * sin,
      r4 = ux * uy * negative - uz * sin,
      r5 = uy * uy * negative + cos,
      r6 = uz * uy * negative + ux * sin,
      r8 = ux * uz * negative + uy * sin,
      r9 = uy * uz * negative - ux * sin,
      r10 = uz * uz * negative + cos

    const d0 = matrix[0] * r0 + matrix[4] * r1 + matrix[8] * r2,
      d1 = matrix[1] * r0 + matrix[5] * r1 + matrix[9] * r2,
      d2 = matrix[2] * r0 + matrix[6] * r1 + matrix[10] * r2,
      d3 = matrix[3] * r0 + matrix[7] * r1 + matrix[11] * r2,
      d4 = matrix[0] * r4 + matrix[4] * r5 + matrix[8] * r6,
      d5 = matrix[1] * r4 + matrix[5] * r5 + matrix[9] * r6,
      d6 = matrix[2] * r4 + matrix[6] * r5 + matrix[10] * r6,
      d7 = matrix[3] * r4 + matrix[7] * r5 + matrix[11] * r6,
      d8 = matrix[0] * r8 + matrix[4] * r9 + matrix[8] * r10,
      d9 = matrix[1] * r8 + matrix[5] * r9 + matrix[9] * r10,
      d10 = matrix[2] * r8 + matrix[6] * r9 + matrix[10] * r10,
      d11 = matrix[3] * r8 + matrix[7] * r9 + matrix[11] * r10

    this.value = [
      d0,
      d1,
      d2,
      d3,
      d4,
      d5,
      d6,
      d7,
      d8,
      d9,
      d10,
      d11,
      matrix[12],
      matrix[13],
      matrix[14],
      matrix[15],
    ]
    return this
  }

  rotateX = (deg: number = 0) => {
    return this.rotate3d(1, 0, 0, deg)
  }

  rotateY = (deg: number = 0) => {
    return this.rotate3d(0, 1, 0, deg)
  }

  rotateZ = (deg: number = 0) => {
    return this.rotate3d(0, 0, 1, deg)
  }

  rotate = (deg: number = 0) => {
    return this.rotate3d(0, 0, 1, deg)
  }

  // translate
  translate3d = (x: number = 0, y: number = 0, z: number = 0) => {
    const matrix = this.value
    const c12 = x * matrix[0] + y * matrix[4] + z * matrix[8] + matrix[12],
      c13 = x * matrix[1] + y * matrix[5] + z * matrix[9] + matrix[13],
      c14 = x * matrix[2] + y * matrix[6] + z * matrix[10] + matrix[14],
      c15 = x * matrix[3] + y * matrix[7] + z * matrix[11] + matrix[15]

    this.value = [
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4],
      matrix[5],
      matrix[6],
      matrix[7],
      matrix[8],
      matrix[9],
      matrix[10],
      matrix[11],
      c12,
      c13,
      c14,
      c15,
    ]
    return this
  }

  translateX = (x: number = 0) => {
    return this.translate3d(x, 0, 0)
  }

  translateY = (y: number = 0) => {
    return this.translate3d(0, y, 0)
  }

  translateZ = (z: number = 0) => {
    return this.translate3d(0, 0, z)
  }

  translate = (x: number = 0, y: number = 0) => {
    return this.translate3d(x, y, 0)
  }

  // scale
  scale3d = (x: number = 1, y: number = 1, z: number = 1) => {
    const matrix = this.value
    const s0 = matrix[0] * x,
      s4 = matrix[4] * y,
      s8 = matrix[8] * z,
      s1 = matrix[1] * x,
      s5 = matrix[5] * y,
      s9 = matrix[9] * z,
      s2 = matrix[2] * x,
      s6 = matrix[6] * y,
      s10 = matrix[10] * z,
      s3 = matrix[3] * x,
      s7 = matrix[7] * y,
      s11 = matrix[11] * z

    this.value = [
      s0,
      s1,
      s2,
      s3,
      s4,
      s5,
      s6,
      s7,
      s8,
      s9,
      s10,
      s11,
      matrix[12],
      matrix[13],
      matrix[14],
      matrix[15],
    ]
    return this
  }

  scaleX = (x: number = 1) => {
    return this.scale3d(x, 1, 1)
  }

  scaleY = (y: number = 1) => {
    return this.scale3d(1, y, 1)
  }

  scaleZ = (z: number = 1) => {
    return this.scale3d(1, 1, z)
  }

  // skew
  scale = (x: number = 1, y: number = 1) => {
    return this.scale3d(x, y, 1)
  }

  skew = (x: number = 0, y: number = 0) => {
    const matrix = this.value
    const xtan = Math.tan((Math.PI * x) / 180)
    const ytan = Math.tan((Math.PI * y) / 180)

    const f0 = matrix[0] + matrix[4] * ytan,
      f1 = matrix[1] + matrix[5] * ytan,
      f2 = matrix[2] + matrix[6] * ytan,
      f3 = matrix[3] + matrix[7] * ytan,
      f4 = matrix[0] * xtan + matrix[4],
      f5 = matrix[1] * xtan + matrix[5],
      f6 = matrix[2] * xtan + matrix[6],
      f7 = matrix[3] * xtan + matrix[7]

    this.value = [
      f0,
      f1,
      f2,
      f3,
      f4,
      f5,
      f6,
      f7,
      matrix[8],
      matrix[9],
      matrix[10],
      matrix[11],
      matrix[12],
      matrix[13],
      matrix[14],
      matrix[15],
    ]
    return this
  }

  skewX = (x: number = 0) => {
    return this.skew(x, 0)
  }

  skewY = (y: number = 0) => {
    return this.skew(0, y)
  }

  // set style
  get = () => {
    return this.value
  }

  toString = () => {
    return `matrix(${this.value.join(',')})`
  }
}
