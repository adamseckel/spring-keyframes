import React, { useEffect } from 'react'
import Head from 'next/head'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/core'
import { Logo } from '../components/icons'
import { Column, Row } from 'emotion-box'
import { useInView } from 'react-hook-inview'

import { animated } from '@spring-keyframes/react-emotion'

const Home = () => {
  const [ref, isVisible] = useInView({
    threshold: 0.5,
    unobserveOnEnter: true,
  })

  const [sectionTwoRef, sectionTwoIsVisible] = useInView({
    threshold: 0.5,
    unobserveOnEnter: true,
  })

  return (
    <div>
      <Global
        styles={css`
          body {
            margin: 0;
            background: #000;
            color: #fff;
            h1,
            h2,
            h3,
            h4,
            button,
            p {
              margin: 0;
            }
            * {
              box-sizing: border-box;
            }
            font-family: ---apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
              sans-serif;
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
                Lightning fast, fire-and-forget, interruptible, <br /> physics
                based, <span style={{ color: 'white' }}>css animations.</span>
              </Subtitle>
              <ButtonRow align="center" justify="start">
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
                  }}>
                  <Button href="https://github.com/hemlok/spring-keyframes">
                    Github
                  </Button>
                </animated.div>
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
                    delay: 1000,
                  }}>
                  <Author
                    align="center"
                    justify="start"
                    as="a"
                    href="https://twitter.com/hemlok_">
                    <Avatar />
                    <div style={{ marginLeft: 12 }}>
                      <Text>By</Text>
                      <Text style={{ color: 'white' }}>Adam Seckel</Text>
                    </div>
                  </Author>
                </animated.div>
              </ButtonRow>
            </HeroColumn>
          </Row>
        </Content>
      </Hero>
      {/* <Section>
        <Row align="center" justify="center">
          <SectionColumn
            align="start"
            justify="start"
            ref={ref}
            style={{ height: 400 }}>
            {isVisible && (
              <animated.div
                initial={{ opacity: 0, y: 50, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  stiffness: 200,
                  damping: 10,
                  mass: 1,
                  delay: 800,
                }}>
                <SectionSubtitle>What's the big deal?</SectionSubtitle>
                <SectionTitle>
                  Native CSS animations mean no slow down when the main thread
                  is busy.
                </SectionTitle>
                <SectionText
                  initial={{ opacity: 0, y: 50, scale: 1 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    stiffness: 200,
                    damping: 10,
                    mass: 1,
                    delay: 1200,
                  }}>
                  Spring-keyframes calculates the minimum number of keyframes
                  required to animate from one state to the next before the
                  animation has even started. Once the animation begins, no
                  javascript is required to keep it going. This means animations
                  will always run smoothly and at full speed, and when your app
                  or website is first loaded.
                </SectionText>
              </animated.div>
            )}
          </SectionColumn>
        </Row>
      </Section>
      <Section>
        <Row align="center" justify="center">
          <SectionColumn
            align="start"
            justify="start"
            ref={sectionTwoRef}
            style={{ height: 400 }}>
            {sectionTwoIsVisible && (
              <animated.div
                initial={{ opacity: 0, y: 50, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  stiffness: 200,
                  damping: 10,
                  mass: 1,
                  delay: 800,
                }}>
                <Row align="start" justify="start">
                  <div>
                    <ExampleBox
                      initial={{ scale: 0, rotate: 91 }}
                      animate={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 2, rotate: 45 }}
                      whileTap={{ scale: 1.4, rotate: 90 }}
                      transition={{
                        stiffness: 400,
                        damping: 8,
                        mass: 1.5,
                        delay: 1000,
                      }}
                    />
                  </div>
                  <SectionTitle>
                    Easily implement everyday interactions, and stop worrying
                    about performance.
                  </SectionTitle>
                </Row>
                <SectionText
                  initial={{ opacity: 0, y: 50, scale: 1 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    stiffness: 200,
                    damping: 10,
                    mass: 1,
                    delay: 1200,
                  }}>
                  Spring-keyframes calculates the minimum number of keyframes
                  required to animate from one state to the next before the
                  animation has even started. Once the animation begins, no
                  javascript is required to keep it going. This means animations
                  will always run smoothly and at full speed, and when your app
                  or website is first loaded.
                </SectionText>
              </animated.div>
            )}
          </SectionColumn>
        </Row>
      </Section> */}
    </div>
  )
}

const Section = styled('section')`
  height: 70vh;
`

const Content = styled(Row)`
  max-width: 1000px;
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
    width: 55vw;
    height: 60vh;
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
  user-select: none;
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
  user-select: none;
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

const Text = styled('p')`
  color: #757575;
  font-size: 14px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 500;
`

const SectionColumn = styled(Column)`
  max-width: 660px;
`

const SectionSubtitle = styled('h3')`
  font-size: 36px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 699;
  color: #757575;
  margin-bottom: 8px;
`

const SectionTitle = styled('h2')`
  color: #ffffff;
  font-size: 36px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 799;
`

const SectionText = styled(animated.p)`
  color: #757575;
  font-size: 20px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 500;
  user-select: none;
  margin-top: 42px;
`

const ExampleBox = styled(animated.div)`
  border-radius: 16px;
  background: #06fdff;
  width: 100px;
  height: 100px;
`

export default Home
