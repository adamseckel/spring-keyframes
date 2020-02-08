export const interpolate = (
  inputMax: number = 0,
  inputMin: number = 0,
  outputMax: number = 0,
  outputMin: number = 0
) => (value: number): number =>
  ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
  outputMin
