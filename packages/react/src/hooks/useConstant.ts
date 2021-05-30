import { useRef } from "react"

type Init<T> = () => T

export function useConstant<T>(init: Init<T>) {
  const ref = useRef<T | null>(null)

  if (ref.current === null) ref.current = init()

  return ref.current
}
