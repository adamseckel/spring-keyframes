import createEmotion from 'create-emotion'
import * as React from 'react'

const { keyframes } = createEmotion({
  key: 'spring-keyframes',
})

export const KeyframesContext = React.createContext<(...args: any) => string>(
  keyframes
)

export function KeyframesProvider({
  fn,
  children,
}: {
  fn: (...args: any) => string
  children: React.ReactNode
}) {
  return (
    <KeyframesContext.Provider value={fn || keyframes}>
      {children}
    </KeyframesContext.Provider>
  )
}
