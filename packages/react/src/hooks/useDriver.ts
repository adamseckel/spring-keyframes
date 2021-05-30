import { KeyframesContext } from "../components/Keyframes"
import { Driver } from "../Driver"
import { useConstant } from "./useConstant"
import { useLayoutEffect, useEffect, useContext, useRef } from "react"
import { usePresence } from "framer-motion"

const createAnimation = (ref: React.RefObject<HTMLElement>, invertedRef?: React.RefObject<HTMLElement>) => (
  animations: string[],
  inversion: string | false | undefined
) => {
  if (!ref.current) return
  ref.current.style.animation = animations.join(", ")
  if (!invertedRef?.current || !inversion) return
  invertedRef.current.style.animation = inversion
}

export function useDriver(
  ref: React.RefObject<HTMLElement>,
  callback?: () => void,
  invertedRef?: React.RefObject<HTMLElement>
): Driver {
  const keyframes = useContext(KeyframesContext)
  const [isPresent, safeToRemove] = usePresence()
  const driver = useConstant(() => new Driver(ref, keyframes, createAnimation(ref, invertedRef)))
  const remove = useRef(safeToRemove)

  const onAnimationEnd = ({ animationName }: { animationName: string }) => {
    if (!ref.current) return
    if (animationName !== driver.animationName) return

    ref.current.style.animation = ""

    driver.reset()

    if (driver.inverted && invertedRef?.current) invertedRef.current.style.animation = ""
    if (callback) callback()
    remove.current?.()
  }

  useEffect(() => {
    ref.current?.addEventListener("animationend", onAnimationEnd)
    return () => {
      ref.current?.removeEventListener("animationend", onAnimationEnd)
      remove.current?.()
    }
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
