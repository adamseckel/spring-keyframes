import React from 'react'
import Head from 'next/head'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/core'
import { Logo } from '../components/icons'
import { Column, Row } from 'emotion-box'

import { animated } from '@spring-keyframes/react-emotion'

const Home = () => (
  <div>
    <Global
      styles={css`
        body {
          margin: 0;
          background: #000;
          color: #fff;
          h1,
          button,
          p {
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
          font-family: ---apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}
    />
    <Head>
      <title>Spring Keyframes</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Hero align="center" justify="center">
      <Content align="start" justify="start">
        <animated.div
          initial={{ opacity: 0, scale: 0, rotate: -50 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.4, rotate: 20, opacity: 1 }}
          whileTap={{ scale: 2, rotate: 0, opacity: 1 }}
          transition={{
            stiffness: 200,
            damping: 10,
            mass: 1,
            delay: 200,
          }}>
          <Logo />
        </animated.div>
        <Row align="start" justify="start">
          <HeroColumn align="start" justify="start">
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
              Lightning fast, fire-and-forget, interruptible, physics based,{' '}
              <span style={{ color: 'white' }}>css animations.</span>
            </Subtitle>
            <ButtonRow align="center" justify="start">
              <animated.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  stiffness: 200,
                  damping: 10,
                  mass: 1,
                  delay: 800,
                }}>
                <Button href="https://github.com/hemlok/spring-keyframes">
                  {' '}
                  Github{' '}
                </Button>
              </animated.div>
              <animated.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  stiffness: 200,
                  damping: 10,
                  mass: 1,
                  delay: 1000,
                }}>
                <Row align="center" justify="start">
                  <Avatar />
                  <div style={{ marginLeft: 12 }}>
                    <Text>By</Text>
                    <Text style={{ color: 'white' }}>Adam Seckel</Text>
                  </div>
                </Row>
              </animated.div>
            </ButtonRow>
          </HeroColumn>
        </Row>
      </Content>
    </Hero>
  </div>
)

const Content = styled(Row)`
  max-width: 1105px;
  > div:first-of-type {
    margin-right: 80px;
    margin-top: 44px;
    min-width: 94px;
  }
`

const Hero = styled(Row)`
  height: 100vh;
  position: relative;
  &:after {
    position: absolute;
    right: 0;
    content: '';
    width: 882px;
    height: 629px;
    overflow: hidden;
    z-index: -1;
    background: linear-gradient(90deg, #000 0%, #0f0f0f 100%);
  }
`

const Title = styled(animated.h1)`
  font-size: 100px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 600;
`

const HeroColumn = styled(Column)`
  > * {
    margin-bottom: 36px;
  }
`

const Subtitle = styled(animated.p)`
  color: #757575;
  font-size: 20px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 500;
  max-width: 483px;
`

const Button = styled('a')`
  padding: 12px 100px;
  background: #d9d9d9;
  border-radius: 8px;
  color: #000000;
  font-size: 14px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 600;
  text-align: center;
  text-transform: none;
  text-decoration: none;
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

const Avatar = styled('div')`
  border-radius: 50%;
  width: 42px;
  height: 42px;
  background-image: url('avatar.jpeg');
  background-size: cover;
  background-repeat: no-repeat;
`
const Text = styled('p')`
  color: #757575;
  font-size: 14px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 500;
`

export default Home
