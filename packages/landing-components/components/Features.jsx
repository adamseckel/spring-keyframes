import * as React from 'react'
import styled from '@emotion/styled'
import { Section, Subtitle, Title, Text } from './Section'
import { Column, Row } from 'emotion-box'
import { animated } from '@spring-keyframes/react'
import { useRef } from 'react'
import { useEffect } from 'react'

const animate = visible =>
  visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }

export const Features = ({}) => {
  return (
    <Section>
      {({ isVisible, wasVisible }) => (
        <>
          <Subtitle>What can it do.</Subtitle>
          <Title visible={isVisible}>
            Easily implement interruptible interactions, animated exits, or
            updated layout.
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
            By using native css animations, you don't have to compromise between
            top performance and your vision.
          </Text>
          <Examples
            initial={{ opacity: 0, y: 50 }}
            animate={animate(wasVisible)}
            transition={{
              stiffness: 200,
              damping: 10,
              mass: 1,
              delay: 300,
            }}>
            <Column></Column>
            <Column></Column>
          </Examples>
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

const Examples = styled(animated.div)`
  grid-column: 3 / span 8;
  margin-top: 36px;
  margin-left: -24px;
  margin-right: -24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &:first-child {
    margin-right: 24px;
  }
`
