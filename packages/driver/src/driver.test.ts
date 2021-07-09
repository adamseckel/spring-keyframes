import { keyframesDriver as driver, EASE } from "./driver"

it("returns an array of keyframe strings, duration, and ease", () => {
  const { keyframes, duration, ease } = driver(
    { width: 100, x: 0, y: 100, scale: 0 },
    { width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(keyframes).toMatchSnapshot()
  expect(duration).toBe(950)
  expect(ease).toBe(EASE)
})

it("returns an array of keyframe strings, and duration for a long spring", () => {
  const { keyframes, duration } = driver({ width: 100 }, { width: 200 }, { stiffness: 400, damping: 3 })

  expect(keyframes).toMatchSnapshot()
  expect(duration).toBe(2916.6667)
})

it("returns an array of keyframes for 0 value animations", () => {
  const { keyframes, duration } = driver(
    { scaleX: 0, x: 0, opacity: 0 },
    { scaleX: 1, x: 20, opacity: 1 },
    { stiffness: 400, damping: 3 }
  )

  expect(keyframes).toMatchSnapshot()

  expect(duration).toBe(2916.6667)
})

it("returns an array of keyframe strings, and duration for a short spring", () => {
  const { keyframes, duration } = driver({ width: 0 }, { width: 200 }, { stiffness: 2, damping: 3 })

  expect(keyframes).toMatchSnapshot()
  expect(duration).toBe(7616.6667)
})

it("returns an array of valid keyframes for camelCase properties", () => {
  const { keyframes, duration } = driver({ borderRadius: 0 }, { borderRadius: 20 }, { stiffness: 100, damping: 3 })

  expect(keyframes).toMatchSnapshot()
  expect(duration).toBe(2400)
})

it("returns a velocity for a in-progress animation", () => {
  const { keyframes, duration, ease, resolveVelocity } = driver({ x: 0 }, { x: 400 }, { stiffness: 100, damping: 2 })
  expect(resolveVelocity(400)).toBe(-0.005009243938850222)
  expect(ease).toBeDefined()
  expect(keyframes).toBeDefined()
  expect(duration).toBeDefined()
})

// it("returns resolved values for a in-progress animation", () => {
//   const { keyframes, duration } = driver({ x: 0 }, { x: 400 }, { stiffness: 100, damping: 2 })
//   expect(keyframes).toMatchInlineSnapshot(`
//     "0% {transform: translate3d(0px, 0px, 0px);}
//     18.1% {transform: translate3d(691.69px, 0px, 0px);}
//     36.19% {transform: translate3d(187.32px, 0px, 0px);}
//     54.29% {transform: translate3d(555.07px, 0px, 0px);}
//     72.38% {transform: translate3d(286.95px, 0px, 0px);}
//     90.48% {transform: translate3d(482.41px, 0px, 0px);}
//     100% {transform: translate3d(400px, 0px, 0px);}
//     "
//   `)

//   expect(duration).toMatchInlineSnapshot(`"1750ms"`)

//   // Assume that 18.1 has been rounded up from 18.0x
//   expect(resolveValues(0.18 * 1750)).toMatchObject({
//     x: 691.69,
//   })
//   // Assume that 54.29 has been rounded up from 54.28x
//   expect(resolveValues(0.5428 * 1750)).toMatchObject({
//     x: 555.07,
//   })
//   expect(resolveValues(0.7238 * 1750)).toMatchObject({
//     x: 286.95,
//   })
// })

it("returns keyframes for scale props, for each frame when withInvertedScale is true", () => {
  const { keyframes, inversions, duration, ease, resolveVelocity } = driver(
    { x: 0, scaleY: 0 },
    { x: 400, scaleY: 1 },
    { withInversion: true }
  )

  expect(ease).toBeDefined()
  expect(resolveVelocity).toBeDefined()
  expect(duration).toMatchSnapshot()
  expect(keyframes).toMatchSnapshot()
  expect(inversions).toMatchSnapshot()
})

it("doesn't overwrite scaleX and scaleY with a scale value", () => {
  const { keyframes } = driver({ x: 0, scale: 1, scaleY: 0, scaleX: 0 }, { x: 400, scale: 1, scaleY: 0.5, scaleX: 0.5 })

  expect(keyframes).toMatchInlineSnapshot(`
    "0% {transform: translate3d(0px, 0px, 0px) scale3d(0, 0, 1);}
    28.07% {transform: translate3d(482.978px, 0px, 0px) scale3d(0.6037, 0.6037, 1);}
    56.14% {transform: translate3d(382.8561px, 0px, 0px) scale3d(0.4786, 0.4786, 1);}
    84.21% {transform: translate3d(403.5284px, 0px, 0px) scale3d(0.5044, 0.5044, 1);}
    100% {transform: translate3d(400px, 0px, 0px) scale3d(0.5, 0.5, 1);}"
  `)
})
