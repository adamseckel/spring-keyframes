import * as React from 'react'
import { Row } from 'emotion-box'
import { Title, Text as MainText, Subtitle } from './Section'
import { animated } from '@spring-keyframes/react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { Text } from './Typography'

export function Features({ isVisible, animate }) {
  const [currentFeatureIndex, setCurrentFeatureIndex] = React.useState(0)
  const currentFeatureRef = React.useRef(currentFeatureIndex)

  const features = [
    { title: 'Sequence', color: '#FF0069' },
    { title: 'Animate on exit', color: '#0052FF' },
    { title: 'Animate to new props', color: '#FD200F' },
    { title: 'Interruptable interactions', color: '#06FDFF' },
  ]

  React.useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      currentFeatureRef.current =
        currentFeatureRef.current + 1 === features.length
          ? 0
          : currentFeatureRef.current + 1
      setCurrentFeatureIndex(currentFeatureRef.current)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [isVisible, currentFeatureIndex])

  return (
    <Row align="stretch" justify="start">
      <div style={{ marginRight: 24 }}>
        <Subtitle> Some subtitle</Subtitle>
        <Title>Easily implement everyday animations.</Title>
        <animated.div
          initial={{ opacity: 0, y: 50 }}
          animate={animate(isVisible)}
          transition={{
            stiffness: 200,
            damping: 10,
            mass: 1,
            delay: 300,
          }}>
          <MainText>
            By using native css animations, you don't have to compromise between
            top performance and your vision.
          </MainText>
        </animated.div>
        <div style={{ maxWidth: 300, marginTop: 42 }}>
          {features.map((feature, i) => {
            return (
              <animated.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={animate(isVisible)}
                transition={{
                  stiffness: 200,
                  damping: 16,
                  mass: 1,
                  delay: 400 + i * 200,
                }}>
                <animated.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 }}
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  transition={{
                    stiffness: 200,
                    damping: 10,
                    mass: 1,
                  }}
                  onClick={() => setCurrentFeatureIndex(i)}>
                  <div
                    style={{
                      cursor: 'pointer',
                      margin: '14px 0',
                      color:
                        currentFeatureIndex === i ? feature.color : '#1d1d1d',
                    }}>
                    <Text
                      style={{
                        color: 'currentColor',
                        marginBottom: '8px',
                        fontWeight: 600,
                        userSelect: 'none',
                        fontSize: 22,

                        transition: 'color .5s ease, opacity .5s ease',
                      }}>
                      {feature.title}
                    </Text>
                    <Track>{currentFeatureIndex === i && <Runner />}</Track>
                  </div>
                </animated.div>
              </animated.div>
            )
          })}
        </div>
      </div>
      <Row grow justify="start" align="center" style={{ maxWidth: '33%' }}>
        <ExampleBox
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1.4, rotate: 45 }}
          whileHover={{ scale: 1, rotate: 45 }}
          whileTap={{ scale: 1.4, rotate: 0 }}
          color={features[currentFeatureIndex].color}
          transition={{
            stiffness: 400,
            damping: 8,
            mass: 1.5,
            delay: 800,
            withInvertedScale: true,
          }}>
          <p> wow </p>
        </ExampleBox>
      </Row>
    </Row>
  )
}

const ExampleBox = styled(animated.div)`
  border-radius: 24px;
  background: ${props => props.color};
  transition: background 0.5s ease;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Track = styled('div')`
  height: 4px;
  background-color: #1d1d1d;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 1;
`

const runnerAnimation = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`

const Runner = styled('div')`
  height: 4px;
  background-color: currentColor;
  position: absolute;
  left: 0;
  right: 0;
  animation: ${runnerAnimation} linear 5000ms both 1;
  transform-origin: left;
`
