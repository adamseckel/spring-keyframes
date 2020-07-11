import React from 'react'
import Head from 'next/head'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/core'
import { Grid, Body } from '../components/Grid'
import { Hero } from '../components/Hero'
import { Explainer } from '../components/Explainer'
import { Column, Row } from 'emotion-box'
import { Section } from '../components/Section'
import { animated } from '@spring-keyframes/react'
// import {
//   Notifications,
//   LayeredNotifications,
// } from '../components/Notifications'
import { Features } from '../components/Features'
import { Static } from '../components/Static'
import { Runner } from '../components/Section'

const Home = () => {
  const animate = (visible) =>
    visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }

  return (
    <Body>
      <Global
        styles={css`
          body {
            --background: #000;
            --light-background: #141414;
            --dark-background: #080808;
            --text: #fff;
            --dark-text: #757575;
            --button-background: #d9d9d9;
            --button-text: #000;
            --ruler: #222222;

            @media (prefers-color-scheme: light) {
              --background: #fff;
              --light-background: #dfdfdf;
              --dark-background: #f7f7f7;
              --text: #000;
              --dark-text: #555;
              --button-background: #2d2d2d;
              --button-text: #fff;
              --ruler: #cecece;
            }

            margin: 0;
            background: var(--background);
            color: var(--text);
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
      <Grid />
      <Runner>
        <Hero />
        <Explainer />
        <Features />
        <Static />
      </Runner>
    </Body>
  )
}

export default Home
