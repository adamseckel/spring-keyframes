import { useLayoutEffect, useRef, useCallback } from 'react'
import { Play } from './useAnimate'
import { computedStyle, computedStyleForElement } from '../utils/computedFrom'
import { Interaction } from '../utils/types'
import { AnimationState } from './useAnimationState'

export type Layout = {
  left: number
  top: number
  bottom: number
  right: number
  height: number
  width: number
}

const identity = {
  scaleX: 1,
  scaleY: 1,
  x: 0,
  y: 0,
}

const keys = Object.keys(identity)

function getRect(ref: React.RefObject<HTMLElement>) {
  const { x = 0, y = 0, scaleX = 1, scaleY = 1 } = computedStyle(keys, ref)
  const { top, left, right, bottom } = ref.current!.getBoundingClientRect()

  return {
    top,
    left,
    right,
    bottom,
    x,
    y,
    scaleX,
    scaleY,
  }
}

export const useLayoutTransition = (
  ref: React.MutableRefObject<HTMLElement | null>,
  animate: Play,
  layout: boolean,
  state: AnimationState
) => {
  const lastRect = useRef<Layout | null>(null)

  const updateLayout = useCallback(() => {
    if (!ref.current) return

    const { top, left, right, bottom, x, y, scaleX, scaleY } = getRect(ref)

    lastRect.current = {
      top: top - y,
      left: left - x,
      bottom: bottom - y,
      right: right - x,
      height: (bottom - top) / scaleY,
      width: (right - left) / scaleX,
    }
  }, [])

  useLayoutEffect(() => {
    if (!layout) return
    if (!ref.current) return
    const { top, left, right, bottom, x, y, scaleX, scaleY } = getRect(ref)
    console.log({ top, left }, window.scrollX, window.scrollY)
    const scale = state.current.distortion.scale
    const {
      x: offsetX = 0,
      y: offsetY = 0,
      scaleX: offsetScaleX = scale || 1,
      scaleY: offsetScaleY = scale || 1,
    } = state.current.distortion

    const newRect: Layout = {
      top: top - y,
      left: left - x,
      bottom: bottom - y,
      right: right - x,
      height: (bottom - top) / scaleY,
      width: (right - left) / scaleX,
    }

    if (lastRect.current === null) {
      lastRect.current = { ...newRect }
      return
    }

    const oldRect = lastRect.current

    const hasRectChanged =
      newRect.top !== oldRect.top ||
      newRect.left !== oldRect.left ||
      newRect.height !== oldRect.height ||
      newRect.width !== oldRect.width

    if (!hasRectChanged) return

    lastRect.current = { ...newRect }

    const requiresInvertedAnimation =
      state.current.distortion && !state.current.options?.withInvertedScale
    let from
    if (state.current.isInverted) {
      const inverted = computedStyleForElement(
        ['scaleX', 'scaleY'],
        ref.current.childNodes[0] as HTMLElement
      )

      from = {
        scaleX: scaleX * (inverted?.scaleX || 1),
        scaleY: scaleY * (inverted?.scaleY || 1),
      }
    } else {
      from = { scaleX, scaleY }
    }

    const invertedAnimation = {
      from,
      to: { scaleX: offsetScaleX, scaleY: offsetScaleY },
    }

    animate({
      to: {
        x: identity.x + offsetX,
        y: identity.y + offsetY,
        scaleX: identity.scaleX * offsetScaleX,
        scaleY: identity.scaleY * offsetScaleY,
      },
      from: {
        x:
          (oldRect.right - newRect.right + oldRect.left - newRect.left) / 2 + x,
        y:
          (oldRect.bottom - newRect.bottom + oldRect.top - newRect.top) / 2 + y,
        scaleX: (oldRect.width * scaleX) / newRect.width,
        scaleY: (oldRect.height * scaleY) / newRect.height,
      },
      withDelay: false,
      interaction: Interaction.Layout,

      // If there is distortion created by an interaction, and that interaction is inverting that distortion onto it's children,
      // Ensure that we factor that inverted distortion into the inversion we create for our layout transition. 🤯
      invertedAnimation: requiresInvertedAnimation
        ? invertedAnimation
        : undefined,
    })
  }, [animate])

  return { updateLayout }
}
