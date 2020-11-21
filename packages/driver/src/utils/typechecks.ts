export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number"
}
