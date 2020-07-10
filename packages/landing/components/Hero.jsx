import * as React from 'react'
import { Text } from './Typography'
import styled from '@emotion/styled'
import { Column, Row } from 'emotion-box'
import { animated } from '@spring-keyframes/react'
import { ColumnGrid } from './Grid'

export const Hero = () => {
  return (
    <HeroContainer align="center" justify="center">
      <Title
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          stiffness: 200,
          damping: 10,
          mass: 1,
          delay: 400,
        }}>
        spring <br />
        keyframes.
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          stiffness: 200,
          damping: 10,
          mass: 1,
          delay: 600,
        }}>
        Lightning fast, fire-and-forget, interruptible, physics based,
        <br />
        <a
          style={{ color: 'var(--text)', textDecoration: 'none' }}
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/animation">
          css animations.
        </a>
      </Subtitle>
      <animated.div
        initial={{ opacity: 0, y: 50, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          scale: 1.04,
          y: 0,
          opacity: 1,
        }}
        whileTap={{
          scale: 0.94,
          y: 0,
          opacity: 1,
        }}
        transition={{
          stiffness: 200,
          damping: 10,
          mass: 1,
          delay: 800,
        }}
        style={{ gridColumn: '2 / span 3', padding: '12px 0' }}>
        <Button
          href="https://github.com/hemlok/spring-keyframes"
          target="_blank">
          Github
        </Button>
      </animated.div>
      {/* <animated.div
        style={{ gridColumn: '5 / span 3' }}
        initial={{ opacity: 0, y: 50, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          scale: 1.04,
          y: 0,
          opacity: 1,
        }}
        whileTap={{
          scale: 0.94,
          y: 0,
          opacity: 1,
        }}
        transition={{
          stiffness: 200,
          damping: 10,
          mass: 1,
          delay: 1000,
        }}>
        <Author
          align="center"
          justify="start"
          target="_blank"
          as="a"
          href="https://twitter.com/hemlok_">
          <Avatar />
          <div style={{ marginLeft: 12 }}>
            <Text>By</Text>
            <Text style={{ color: 'white' }}>Adam Seckel</Text>
          </div>
        </Author>
      </animated.div> */}
    </HeroContainer>
  )
}

const HeroContainer = styled(ColumnGrid)`
  height: 100vh;
  position: relative;
  align-content: center;
  /* &:after {
    position: absolute;
    right: 0;
    content: '';
    width: 55vw;
    height: 60vh;
    overflow: hidden;
    z-index: -1;
    background: linear-gradient(90deg, #000 0%, #0f0f0f 100%);
  } */
  > * {
    margin-bottom: 36px;
  }
`

const Title = styled(animated.h1)`
  font-size: 100px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 600;
  user-select: none;
  grid-column: 2 / span 11;
  margin-left: -5px;
`

const Subtitle = styled(animated.p)`
  color: var(--dark-text);
  font-size: 28px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 500;
  max-width: 483px;
  user-select: none;
  grid-column: 2 / span 11;
`

const Button = styled('a')`
  padding: 12px 0;
  display: block;
  width: 100%;
  background: var(--button-background);
  border-radius: 8px;
  color: var(--button-text);
  font-size: 14px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 600;
  text-align: center;
  text-transform: none;
  text-decoration: none;
  user-select: none;
  transition: all 0.2s ease;
  &:active {
    color: initial;
  }
`

const ButtonRow = styled(Row)`
  margin-top: 20px;
  > * {
    margin-right: 42px;
  }
`

const Author = styled(Row)`
  text-decoration: none;
`
const Avatar = styled('div')`
  border-radius: 50%;
  width: 42px;
  height: 42px;
  background-image: url('avatar.jpeg');
  background-size: cover;
  background-repeat: no-repeat;
`
