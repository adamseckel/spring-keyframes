import { useLayoutEffect } from 'react'
import { AnimateToFrame } from './useAnimateToFrame'
import { computedFrom } from '../utils/computedFrom'

interface Props {
  ref: React.MutableRefObject<HTMLElement | null>
  animateToFrame: AnimateToFrame
  layout: React.MutableRefObject<Layout | null>
  withPositionTransition?: boolean
  withSizeTransition?: boolean
}

export type Layout = {
  x: number
  y: number
  height: number
  width: number
}

type Transform = {
  x: number
  y: number
  scaleX: number
  scaleY: number
}

const defaultSize = {
  scaleX: 1,
  scaleY: 1,
}

const defaultPosition = {
  x: 0,
  y: 0,
}

export function useLayoutTransition({
  ref,
  animateToFrame,
  layout,
  withPositionTransition,
  withSizeTransition,
}: Props): void {
  useLayoutEffect(() => {
    if (!ref.current) return

    const l = layout.current
    const { x = 0, y = 0, scaleX = 1, scaleY = 1 } = computedFrom(
      { ...defaultSize, ...defaultPosition },
      ref
    ) as Transform

    const offsetOldLayout = {
      y: ref.current.offsetTop + y,
      x: ref.current.offsetLeft + x,
      height: ref.current.offsetHeight * scaleY,
      width: ref.current.offsetWidth * scaleX,
    }

    layout.current = offsetOldLayout

    if (!l) return

    if (
      ref.current.offsetTop !== l.y ||
      ref.current.offsetLeft !== l.x ||
      ref.current.offsetHeight !== l.height ||
      ref.current.offsetWidth !== l.width
    ) {
      const oldSize = {
        scaleX: l.width / offsetOldLayout.width,
        scaleY: l.height / offsetOldLayout.height,
      }

      const oldPosition = {
        x: l.x - offsetOldLayout.x - (offsetOldLayout.width - l.width) / 2,
        y: l.y - offsetOldLayout.y - (offsetOldLayout.height - l.height) / 2,
      }

      animateToFrame({
        frame: {
          ...(withPositionTransition ? defaultPosition : {}),
          ...(withSizeTransition ? defaultSize : {}),
        },
        absoluteFrom: {
          ...(withPositionTransition ? oldPosition : {}),
          ...(withSizeTransition ? oldSize : {}),
        },
        withDelay: false,
        name: 'layout',
      })
    }
  }, [animateToFrame])
}
