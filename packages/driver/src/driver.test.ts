import { driver, EASE } from "./driver"

it("returns an array of keyframe strings, duration, and ease", () => {
  const { sprung, duration, ease } = driver(
    { width: 100, x: 0, y: 100, scale: 0 },
    { width: 200, x: 20, y: 50, scale: 1 }
  )

  expect(sprung).toMatchSnapshot()
  expect(duration).toMatchInlineSnapshot(`"950ms"`)
  expect(ease).toBe(EASE)
})

it("returns an array of keyframe strings, and duration for a long spring", () => {
  const { sprung, duration } = driver({ width: 100 }, { width: 200 }, { stiffness: 400, damping: 3 })

  expect(sprung).toMatchSnapshot()
  expect(duration).toMatchInlineSnapshot(`"2916.6667ms"`)
})

it("returns an array of keyframes for 0 value animations", () => {
  const { sprung, tweened, duration } = driver(
    { scaleX: 0, x: 0, opacity: 0 },
    { scaleX: 1, x: 20, opacity: 1 },
    { stiffness: 400, damping: 3 }
  )

  expect(sprung).toMatchSnapshot()
  expect(tweened).toMatchSnapshot()
  expect(duration).toMatchInlineSnapshot(`"2916.6667ms"`)
})

it("returns an array of keyframe strings, and duration for a short spring", () => {
  const { sprung, duration } = driver({ width: 0 }, { width: 200 }, { stiffness: 2, damping: 3 })

  expect(sprung).toMatchSnapshot()
  expect(duration).toMatchInlineSnapshot(`"7616.6667ms"`)
})

it("returns an array of keyframe strings, and duration for a tweened animation", () => {
  const { sprung, tweened, duration } = driver({ opacity: 0 }, { opacity: 1 }, { stiffness: 100, damping: 3 })

  expect(tweened).toMatchSnapshot()
  expect(sprung).toBeUndefined()
  expect(duration).toMatchInlineSnapshot(`"2400ms"`)
})

it("returns an array of keyframe strings, and duration for a tweened and sprung animation", () => {
  const { tweened, sprung, duration } = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3 }
  )

  expect(sprung).toMatchSnapshot()
  expect(tweened).toMatchSnapshot()
  expect(duration).toMatchInlineSnapshot(`"2400ms"`)
})

it("returns an array of valid keyframes for camelCase properties", () => {
  const { sprung, duration } = driver({ borderRadius: 0 }, { borderRadius: 20 }, { stiffness: 100, damping: 3 })

  expect(sprung).toMatchSnapshot()
  expect(duration).toMatchInlineSnapshot(`"2400ms"`)
})

it("returns tweened animations for all tweened property values", () => {
  const { sprung, tweened, duration } = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweened: ["opacity", "x"] }
  )

  expect(tweened).toMatchSnapshot()
  expect(sprung).toBeUndefined()
  expect(duration).toMatchInlineSnapshot(`"2400ms"`)
})

it("returns tweened animations for custom tweened property values", () => {
  const { sprung, tweened, duration } = driver(
    { opacity: 0, x: 0 },
    { opacity: 1, x: 100 },
    { stiffness: 100, damping: 3, tweened: ["x"] }
  )

  expect(sprung).toMatchSnapshot()
  expect(tweened).toMatchSnapshot()
  expect(duration).toMatchInlineSnapshot(`"2400ms"`)
})

it("returns an array of valid keyframes for backgroundColor", () => {
  const { sprung, tweened, duration } = driver(
    { backgroundColor: "red" },
    { backgroundColor: "blue" },
    { stiffness: 100, damping: 3 }
  )

  expect(sprung).toBeUndefined()
  expect(tweened).toMatchSnapshot()
  expect(duration).toMatchSnapshot()
})

it("returns a velocity for a in-progress animation", () => {
  const { sprung, duration, ease, resolveVelocity } = driver({ x: 0 }, { x: 400 }, { stiffness: 100, damping: 2 })
  expect(resolveVelocity(400)).toBe(-0.005009243938850222)
  expect(ease).toBeDefined()
  expect(sprung).toBeDefined()
  expect(duration).toBeDefined()
})

// it("returns resolved values for a in-progress animation", () => {
//   const { sprung, duration } = driver({ x: 0 }, { x: 400 }, { stiffness: 100, damping: 2 })
//   expect(sprung).toMatchInlineSnapshot(`
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
  const { sprung, inverted, duration, ease, resolveVelocity } = driver(
    { x: 0, scaleY: 0 },
    { x: 400, scaleY: 1 },
    { withInversion: true }
  )

  expect(ease).toBeDefined()
  expect(resolveVelocity).toBeDefined()
  expect(duration).toMatchSnapshot()
  expect(sprung).toMatchSnapshot()
  expect(inverted).toMatchSnapshot()
})

it("doesn't overwrite scaleX and scaleY with a scale value", () => {
  const { sprung } = driver({ x: 0, scale: 1, scaleY: 0, scaleX: 0 }, { x: 400, scale: 1, scaleY: 0.5, scaleX: 0.5 })

  expect(sprung).toMatchInlineSnapshot(`
    "0% {transform: translate3d(0px, 0px, 0px) scale3d(0, 0, 1);}
    28.0702% {transform: translate3d(482.978px, 0px, 0px) scale3d(0.6037, 0.6037, 1);}
    56.1404% {transform: translate3d(382.8561px, 0px, 0px) scale3d(0.4786, 0.4786, 1);}
    84.2105% {transform: translate3d(403.5284px, 0px, 0px) scale3d(0.5044, 0.5044, 1);}
    100% {transform: translate3d(400px, 0px, 0px) scale3d(0.5, 0.5, 1);}
    "
  `)
})
