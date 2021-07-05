import * as React from "react"
import { StyleSheet } from "../utils/sheet"

const key = "spring-keyframes"
const sheet = new StyleSheet({ key, speedy: true })

const create = (name: string, frames: string) => sheet.insert(name, `@keyframes ${name}{${frames}}`)
const flush = (keys: string[]) => sheet.flushKeys(keys)

export interface Keyframes {
  create(name: string, rule: string): void
  flush(keys: string[]): void
}

export const KeyframesContext = React.createContext<Keyframes>({ create, flush })
