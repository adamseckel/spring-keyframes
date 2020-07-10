import * as React from 'react'
import styled from '@emotion/styled'
import { Section, Subtitle, Title, Text } from './Section'
import { Column, Row } from 'emotion-box'
import { animated, driver, AnimateExit } from '@spring-keyframes/react'
import { useRef } from 'react'
import { useEffect, useState, useCallback } from 'react'
import { springEveryFrame } from '@spring-keyframes/driver'

const width = 215
const height = 120 - 12 * 2

export const Visualizer = ({ options, style }) => {
  const [maxes] = springEveryFrame({
    ...options,
    precision: 0.01,
    velocity: 0,
    withInvertedScale: false,
    withEveryFrame: true,
  })

  let tick = null
  let scale = 1

  // Increase scale until ~20 lines.
  while (tick === null) {
    const proposedTick = Math.round(maxes.length / scale)

    if (proposedTick < 25 && proposedTick > 10) {
      tick = proposedTick
      break
    }

    scale = scale + 1
  }

  const ticks = Array(tick + 1).fill('')
  const offsetPerTick = width / tick

  return (
    <VizContainer style={style}>
      <VizLinesContainer>
        <AnimateExit>
          <VizOverflow>
            {ticks.map((_, i) => (
              <VizLine
                key={i}
                initial={{ x: 0 }}
                animate={{ x: i * offsetPerTick }}
                exit={{ x: 0, opacity: 0 }}
              />
            ))}
          </VizOverflow>

          {maxes.map((max, i) => {
            const x =
              i === maxes.length - 1
                ? width
                : Math.max(i - 1, 0) * (width / maxes.length)
            const y = height - max[0] * (height / 2)
            return max[3] ? (
              <Keyframe
                key={i}
                initial={{
                  x,
                  rotate: 45,
                  y,
                  opacity: 0,
                }}
                animate={{
                  x,
                  y,
                  rotate: 45,
                  opacity: 1,
                }}
                exit={{
                  x,
                  y,
                  rotate: 45,
                  opacity: 0,
                }}
              />
            ) : null
          })}
        </AnimateExit>

        <SpringVisualiser maxes={maxes} />
      </VizLinesContainer>
    </VizContainer>
  )
}

const VizContainer = styled.div`
  width: 100%;
  height: 120px;
  background: var(--dark-background);
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  overflow: visible;
  position: relative;
`

const VizLinesContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
`

const VizOverflow = styled.div`
  width: calc(100% + 1px);
  height: 100%;
  position: absolute;
  overflow: hidden;
`

const VizLine = styled(animated.div)`
  width: 1px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px dashed var(--ruler);
`

const Keyframe = styled(animated.div)`
  width: 5px;
  height: 5px;
  background-color: var(--text);
  position: absolute;
  top: -2.5px;
  left: -2px;
  z-index: 2;
`

function SpringVisualiser({ maxes }) {
  let curveLine = `M${0} ${height}`
  const spacePerTick = width / maxes.length

  for (let i = 0; i < maxes.length; i++) {
    const [value] = maxes[i]
    const x = i * spacePerTick

    curveLine += `L${x} ${height - value * (height / 2)}`
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{ zIndex: 1, position: 'relative' }}>
      <path
        d={curveLine}
        fill="transparent"
        strokeWidth="2"
        stroke="var(--dark-text)"
        strokeLinecap="round"></path>
    </svg>
  )
}
