import { Driver } from "../Driver"
import { useConstant } from "./useConstant"
import { useLayoutEffect, useEffect, useRef, useCallback } from "react"
import { usePresence } from "framer-motion"

export function useDriver(
  ref: React.RefObject<HTMLElement>,
  callback?: () => void,
  _invertedRef?: React.RefObject<HTMLElement>
): Driver {
  const [isPresent, safeToRemove] = usePresence()
  const remove = useRef(safeToRemove)
  const onComplete = useCallback(() => {
    remove.current?.()
    callback?.()
  }, [])
  const driver = useConstant(() => new Driver(ref, onComplete, _invertedRef))

  useEffect(() => {
    return () => remove.current?.()
  }, [])

  useEffect(() => {
    if (isPresent === false && safeToRemove) {
      remove.current = safeToRemove
      return
    }
    remove.current = undefined
  }, [isPresent, safeToRemove])

  useLayoutEffect(driver.init, [])

  return driver
}
