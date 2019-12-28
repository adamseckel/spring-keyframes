export const interpolate = (
  inputMax: number = 0,
  inputMin: number = 0,
  outputMax: number = 0,
  outputMin: number = 0,
  roundTo: number = 100
) => (value: number) => {
  return (
    Math.round(
      (((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
        outputMin) *
        roundTo
    ) / roundTo
  )
}
