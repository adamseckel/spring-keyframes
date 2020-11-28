import * as React from "react"

export function useCombinedRefs(...refs: any[]) {
  const targetRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
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
