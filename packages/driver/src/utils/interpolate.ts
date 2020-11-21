export const interpolate = (inputMax = 0, inputMin = 0, outputMax = 0, outputMin = 0) => (
  value: number
): number => ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin
