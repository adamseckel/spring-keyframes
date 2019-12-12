import React, { useEffect, useState, useCallback, useRef } from 'react'
import Head from 'next/head'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/core'
import { Logo } from '../components/icons'
import { Column, Row } from 'emotion-box'
import { useInView } from 'react-hook-inview'

import { animated } from '@spring-keyframes/react-emotion'

const Home = () => {
  const [ref, isVisible] = useInView({
    threshold: 1,
    unobserveOnEnter: true,
  })

  const [sectionTwoRef, sectionTwoIsVisible] = useInView({
    threshold: 0.5,
    unobserveOnEnter: true,
  })

  const [currentFeatureIndex, setCurentFeatureIndex] = useState(0)
  const currentFeatureRef = useRef(currentFeatureIndex)

  const features = [
    { title: 'Sequence', color: '#FF0069' },
    { title: 'Animate on exit', color: '#0052FF' },
    { title: 'Animate to new props', color: '#FD200F' },
    { title: 'Interruptable interactions', color: '#06FDFF' },
  ]

  useEffect(() => {
    if (!sectionTwoIsVisible) return

    const interval = setInterval(() => {
      currentFeatureRef.current =
        currentFeatureRef.current + 1 === features.length
          ? 0
          : currentFeatureRef.current + 1
      setCurentFeatureIndex(currentFeatureRef.current)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [sectionTwoIsVisible, currentFeatureIndex])

  const animate = visible =>
    visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }

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
                based,{' '}
                <a
                  style={{ color: 'white', textDecoration: 'none' }}
                  target="_blank"
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS/animation">
                  css animations.
                </a>
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
                  <Button
                    href="https://github.com/hemlok/spring-keyframes"
                    target="_blank">
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
                    target="_blank"
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

      <Section>
        <Row align="center" justify="center">
          <SectionColumn
            align="start"
            justify="start"
            ref={sectionTwoRef}
            style={{ height: 500 }}>
            <animated.div
              initial={{ opacity: 0, y: 50, scale: 1 }}
              animate={animate(sectionTwoIsVisible)}
              transition={{
                stiffness: 200,
                damping: 10,
                mass: 1,
              }}>
              <Row align="stretch" justify="start">
                <Row
                  grow
                  justify="start"
                  align="center"
                  style={{ maxWidth: '33%' }}>
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
                    }}
                  />
                </Row>
                <div style={{ marginLeft: 24 }}>
                  <SectionTitle>
                    Easily implement everyday animations.
                  </SectionTitle>
                  <SectionText
                    initial={{ opacity: 0, y: 50 }}
                    animate={animate(sectionTwoIsVisible)}
                    transition={{
                      stiffness: 200,
                      damping: 10,
                      mass: 1,
                      delay: 300,
                    }}>
                    By using native css animations, you don't have to compromise
                    between top performance and your vision.
                  </SectionText>
                  <div style={{ maxWidth: 300, marginTop: 42 }}>
                    {features.map((feature, i) => {
                      return (
                        <animated.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 50, scale: 1 }}
                          animate={animate(sectionTwoIsVisible)}
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
                            onClick={() => setCurentFeatureIndex(i)}>
                            <div
                              style={{
                                cursor: 'pointer',
                                margin: '14px 0',
                                color:
                                  currentFeatureIndex === i
                                    ? feature.color
                                    : '#1d1d1d',
                              }}>
                              <Text
                                style={{
                                  color: 'currentColor',
                                  marginBottom: '8px',
                                  fontWeight: 600,
                                  fontSize: 22,
                                  transition:
                                    'color .5s ease, opacity .5s ease',
                                }}>
                                {feature.title}
                              </Text>
                              <Track>
                                {currentFeatureIndex === i && (
                                  <Runner
                                    initial={{ scaleX: 0 }}
                                    animate={{
                                      scaleX: 1,
                                    }}
                                    transition={{
                                      stiffness: 100,
                                      damping: 40,
                                      mass: 700,
                                    }}
                                  />
                                )}
                              </Track>
                            </div>
                          </animated.div>
                        </animated.div>
                      )
                    })}
                  </div>
                </div>
              </Row>
            </animated.div>
          </SectionColumn>
        </Row>
      </Section>

      <Section>
        <Row align="center" justify="center">
          <SectionColumn
            align="start"
            justify="start"
            ref={ref}
            style={{ height: 500 }}>
            <animated.div
              initial={{ opacity: 0, y: 50 }}
              animate={animate(isVisible)}
              transition={{
                stiffness: 200,
                damping: 10,
                mass: 1,
              }}>
              <SectionSubtitle>What's the big deal?</SectionSubtitle>
              <SectionTitle>
                Native CSS animations mean no slow down when the main thread is
                busy.
              </SectionTitle>
              <SectionText
                initial={{ opacity: 0, y: 50 }}
                animate={animate(isVisible)}
                transition={{
                  stiffness: 200,
                  damping: 10,
                  mass: 1,
                  delay: 300,
                }}>
                Spring-keyframes calculates the minimum number of keyframes
                required to animate from one state to the next before the
                animation has even started. Once the animation begins, no
                javascript is required to keep it going. This means animations
                will always run smoothly and at full speed, and when your app or
                website is first loaded.
              </SectionText>
            </animated.div>
          </SectionColumn>
        </Row>
      </Section>
    </div>
  )
}

const Section = styled('section')`
  height: 75vh;
  padding: 100px 0;
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
  font-size: 32px;
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
  margin-top: 28px;
`

const ExampleBox = styled(animated.div)`
  border-radius: 24px;
  background: ${props => props.color};
  transition: background 0.5s ease;
  width: 140px;
  height: 140px;
`

const Track = styled('div')`
  height: 4px;
  background-color: #1d1d1d;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 100%;
`

const Runner = styled(animated.div)`
  height: 4px;
  background-color: currentColor;
  position: absolute;
  left: 0;
  right: 0;
  transform: scale3d(0, 1, 1);
  transform-origin: left;
`

export default Home
