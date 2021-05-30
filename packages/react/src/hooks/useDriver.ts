import { KeyframesContext } from "../components/Keyframes"
import { Driver } from "../Driver"
import { useConstant } from "./useConstant"
import { useLayoutEffect, useEffect, useContext, useCallback } from "react"
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
  const presence = usePresence()
  const driver = useConstant(() => new Driver(ref, keyframes, createAnimation(ref, invertedRef)))

  const onAnimationEnd = useCallback(
    ({ animationName }: { animationName: string }) => {
      if (!ref.current) return
      if (animationName !== driver.animationName) return

      ref.current.style.animation = ""

      driver.reset()

      if (driver.inverted && invertedRef?.current) invertedRef.current.style.animation = ""
      if (callback) callback()

      const [isPresent, safeToRemove] = presence
      if (isPresent === false && safeToRemove) safeToRemove()
    },
    [driver]
  )

  useEffect(() => {
    ref.current?.addEventListener("animationend", onAnimationEnd)
    return () => ref.current?.removeEventListener("animationend", onAnimationEnd)
  }, [])

  useLayoutEffect(driver.init, [])

  return driver
}
