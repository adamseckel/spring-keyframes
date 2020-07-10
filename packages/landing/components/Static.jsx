import * as React from 'react'
import styled from '@emotion/styled'
import { Section, Subtitle, Title, Text } from './Section'
import { Column, Row } from 'emotion-box'
import { animated } from '@spring-keyframes/react'
import { useRef } from 'react'
import { useEffect } from 'react'

const animate = visible =>
  visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }

export const Static = ({}) => {
  return (
    <Section>
      {({ isVisible, wasVisible }) => (
        <>
          <Subtitle>Use it anywhere.</Subtitle>
          <Title visible={isVisible}>
            Generate physics based keyframe animations for use with static
            css-in-js tools like Linaria or Treat.
          </Title>

          <Text
            initial={{ opacity: 0, y: 50 }}
            animate={animate(wasVisible)}
            transition={{
              stiffness: 200,
              damping: 10,
              mass: 1,
              delay: 300,
            }}>
            <b style={{ color: 'var(--text)' }}>@spring-keyframes/react</b>{' '}
            exports the underlying CSS driver. By passing values for a from and
            to frame, as well as the same spring options used by the react
            component or hook, the driver will return a keyframe string,
            duration, and the appropriate cubic-bezier timing function.
          </Text>
          <Text
            initial={{ opacity: 0, y: 50 }}
            animate={animate(wasVisible)}
            transition={{
              stiffness: 200,
              damping: 10,
              mass: 1,
              delay: 300,
            }}>
            <b style={{ color: 'var(--text)' }}>@spring-keyframes/driver</b> is
            also available as a framework independent package, and exports all
            the primitives needed to generate static keyframes, and the tools to
            spring-keyframes/react uses to generate interruptable animations.
          </Text>
        </>
      )}
      {/* 
        <animated.div
          initial={{ opacity: 0, y: 50 }}
          transition={{
            stiffness: 200,
            damping: 10,
            mass: 1,
          }}>
          <Row justify="start" align="start">
            <Column justify="start" align="start">
             
              
            </Column>
            <Row
              grow
              justify="start"
              align="center"
              style={{ maxWidth: '33%' }}></Row>
          </Row>
        </animated.div>
      )} */}
    </Section>
  )
}
