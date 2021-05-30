import { useRef, useEffect } from "react"

export function useCombinedRefs(...refs: any[]) {
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === "function") {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}
