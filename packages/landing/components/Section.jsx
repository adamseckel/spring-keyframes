import styled from '@emotion/styled'
import * as React from 'react'
import { useInView } from 'react-hook-inview'
import { ColumnGrid } from './Grid'
import { useContext, useRef, useState, useEffect } from 'react'
import { animated } from '@spring-keyframes/react'

export const Section = ({ children, threshold = 0.5 }) => {
  const [wasVisible, setWasVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [ref] = useInView(
    {
      threshold,
      onLeave: () => {
        if (isVisible) setIsVisible(false)
      },
      onEnter: () => {
        setIsVisible(true)
        if (!wasVisible) setWasVisible(true)
      },
    },
    [isVisible, wasVisible]
  )

  return (
    <Container ref={ref}>
      {typeof children === 'function'
        ? children({ isVisible, wasVisible })
        : children}
    </Container>
  )
}

const Container = styled(ColumnGrid)`
  padding: 100px 0;
  position: relative;
  align-content: center;
  > * {
    margin-bottom: 36px;
  }
`.withComponent('section')

export const Subtitle = styled('h3')`
  font-size: 32px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 699;
  color: #757575;
  margin-bottom: 16px;
  grid-column: 3 / span 8;
`

const H2 = styled('h2')`
  color: #ffffff;
  font-size: 48px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 799;
  grid-column: 3 / span 8;
  position: relative;
  /* 
  &:after {
    content: '';
    height: 100%;
    width: 3px;
    position: absolute;
    grid-column: 2 / span 1;
    background: white;
    left: -24px;
    top: 0;
  } */
`

const RunnerContext = React.createContext(() => {})

export const Runner = ({ children }) => {
  const [runner, setRunner] = useState(null)

  return (
    <>
      {runner && (
        <RunnerDiv
          initial={{ opacity: 0, x: runner.x, y: runner.y }}
          animate={{ opacity: 1, x: runner.x, y: runner.y }}
          style={{
            height: runner.height,
          }}
        />
      )}
      <RunnerContext.Provider value={setRunner} children={children} />
    </>
  )
}

const RunnerDiv = styled(animated.div)`
  width: 3px;
  background: white;
  position: absolute;
  left: 0;
  top: 0;
`

export const Title = ({ visible, ...props }) => {
  const titleRef = useRef(null)
  const updateRunner = useContext(RunnerContext)

  useEffect(() => {
    if (!visible || !titleRef.current) return

    const rect = titleRef.current.getBoundingClientRect()

    const { x, height, top } = rect
    const scrollY = window.scrollY
    updateRunner({ x: x - 24, height, y: top + scrollY })
  }, [visible])

  return <H2 {...props} ref={titleRef} />
}

export const Text = styled('p')`
  color: #757575;
  font-size: 24px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 500;
  user-select: none;
  grid-column: 3 / span 8;
`
