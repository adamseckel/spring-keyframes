import * as React from "react"
import { useRouter } from "next/router"
import { cx } from "../utils/cx"
import Link from "next/link"
import styles from "./Navigation.module.css"

export interface Item {
  title: string
  slug: string
  depth?: number
  items?: Item[]
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  items: Item[]
}

function addDepth(items: Item[] | undefined, depth = 0, list: Item[]): void {
  if (!items) return
  for (const child of items) {
    list.push(withDepth(child, depth))
    addDepth(child?.items, depth + 1, list)
  }
}

function withDepth(item: Item, depth = 0): Item & { depth: number } {
  return Object.assign(item, { depth })
}

function mapWithDepth(items: Item[]) {
  const list: Item[] = []

  addDepth(items, 0, list)

  return list
}

export function Navigation({ items: nestedItems, className }: Props) {
  const router = useRouter()
  const items = React.useMemo(() => mapWithDepth(nestedItems), [])

  return (
    <nav className={cx(styles.navigation, className)}>
      {items.map((item) => {
        const active = router.asPath === item.slug
        const indentation = (item.depth || 0) * 24
        return (
          <Link href={item.slug} key={item.slug}>
            <a className={cx(styles.item, active && styles.active)} style={{ marginLeft: indentation }}>
              {item.title}
            </a>
          </Link>
        )
      })}
    </nav>
  )
}
