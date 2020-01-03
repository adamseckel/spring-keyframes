import * as React from 'react'
import { StyleSheet } from '../utils/sheet'
import hash from '@emotion/hash'

const key = hash(new Date().toDateString())
const sheet = new StyleSheet({ key })
const animations: Record<string, number> = {}

function keyframes(name: string, frames: string) {
  const existing = animations[name]

  if (existing) {
    animations[name] = existing + 1
  } else {
    animations[name] = 1
    sheet.insert(name, `@keyframes ${name}{${frames}}`)
  }

  return name
}

function flush(keys: string[]) {
  const flushableKeys = []

  if (!Object.keys(animations).length) return sheet.flushAll()

  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]

    if (animations[name]) {
      if (animations[name] === 1) flushableKeys.push(name)
      animations[name] = Math.min(0, animations[name] - 1)
    }
  }

  if (flushableKeys.length) sheet.flushKeys(flushableKeys)
}

export const KeyframesContext = React.createContext<{
  keyframes: (name: string, rule: string) => string
  flush: (keys: string[]) => void
}>({ keyframes, flush })

export function KeyframesProvider({ children }: { children: React.ReactNode }) {
  return (
    <KeyframesContext.Provider value={{ keyframes, flush }}>
      {children}
    </KeyframesContext.Provider>
  )
}
