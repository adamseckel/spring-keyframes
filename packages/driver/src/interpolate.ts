export const interpolate = (
  inputMax: number = 0,
  inputMin: number = 0,
  outputMax: number = 0,
  outputMin: number = 0,
  withEase?: (v: number) => number,
  roundTo: number = 100
) => (value: number) => {
  const fn = withEase ? withEase : (v: number) => v

  return (
    Math.round(
      fn(
        ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
          outputMin
      ) * roundTo
    ) / roundTo
  )
}
