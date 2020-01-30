import * as React from 'react'
import { StyleSheet } from '../utils/sheet'
import hash from '@emotion/hash'

const key = hash(new Date().toDateString())
const sheet = new StyleSheet({ key, speedy: true })
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
  const flushableKeys: string[] = []

  if (!Object.keys(animations).length) return sheet.flushAll()

  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]

    if (animations[name]) {
      if (animations[name] === 1) flushableKeys.push(name)
    }
  }

  if (flushableKeys.length) {
    setTimeout(() => {
      flushableKeys.forEach(key => {
        if (animations[key] > 0) return
        sheet.flushKeys([key])      
        animations[name] = Math.max(0, animations[name] - 1)
      })
    }, 500);
  }
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
