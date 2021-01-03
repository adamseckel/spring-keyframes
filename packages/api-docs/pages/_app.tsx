import Head from "next/head"
import * as React from "react"
import { Layout } from "../components/Layout"
import { Item } from "../components/Navigation"
import "../styles/globals.css"

const items: Item[] = [
  {
    title: "Introduction",
    slug: "/introduction",
    items: [
      { title: "How It Works", slug: "/introduction#how-it-works" },
      { title: "Benefits", slug: "/introduction#benefits" },
    ],
  },
  {
    title: "@spring-keyframes/react",
    slug: "/react",
    items: [
      {
        title: "Quick Start",
        slug: "/react#quick-start",
      },
      {
        title: "Components",
        slug: "/react#components",
        items: [
          {
            title: "Animated",
            slug: "/react#animated",
          },
          {
            title: "CorrectDistortion",
            slug: "/react#correct-distortion",
          },
          {
            title: "AnimateExit",
            slug: "/react#animate-exit",
          },
          {
            title: "Keyframes",
            slug: "/react#keyframes",
          },
        ],
      },
      {
        title: "Hooks",
        slug: "/react#hooks",
        items: [
          {
            title: "useDriver",
            slug: "/react#use-driver",
          },
        ],
      },
      {
        title: "Examples",
        slug: "/react#examples",
      },
    ],
  },
  {
    title: "@spring-keyframes/driver",
    slug: "/driver",
    items: [
      { title: "Quick Start", slug: "/driver#quick-start" },
      { title: "Usage", slug: "/driver#usage" },
      { title: "Options", slug: "/driver#options" },
      { title: "Examples", slug: "/driver#examples" },
    ],
  },
  {
    title: "@spring-keyframes/from-matrix",
    slug: "/from-matrix",
    items: [
      { title: "Quick Start", slug: "/from-matrix#quick-start" },
      { title: "Examples", slug: "/from-matrix#examples" },
    ],
  },
  {
    title: "History",
    slug: "/history",
  },
  {
    title: "Comparisons",
    slug: "/comparisons",
  },
  {
    title: "Acknowledgements",
    slug: "/acknowledgements",
  },
]

function MyApp({ Component, pageProps }) {
  return (
    <Layout items={items}>
      <Head>
        <title>Spring Keyframes Docs</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
