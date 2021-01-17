import Head from "next/head"
import * as React from "react"
import { Layout } from "../components/Layout"
import { Item } from "../components/Navigation"
import { driver } from "@spring-keyframes/driver"
import "../styles/globals.css"
import pkg from "../../driver/package.json"

const items: Item[] = [
  {
    title: "Introduction",
    slug: "/introduction",
    items: [
      { title: "How It Works", slug: "/introduction#how-it-works" },
      { title: "Benefits", slug: "/introduction#benefits" },
    ],
  },
  // {
  //   title: "@spring-keyframes/react",
  //   slug: "/react",
  //   items: [
  //     {
  //       title: "Quick Start",
  //       slug: "/react#quick-start",
  //     },
  //     {
  //       title: "Components",
  //       slug: "/react#components",
  //       items: [
  //         {
  //           title: "Animated",
  //           slug: "/react#animated",
  //         },
  //         {
  //           title: "CorrectDistortion",
  //           slug: "/react#correct-distortion",
  //         },
  //         {
  //           title: "AnimateExit",
  //           slug: "/react#animate-exit",
  //         },
  //         {
  //           title: "Keyframes",
  //           slug: "/react#keyframes",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Hooks",
  //       slug: "/react#hooks",
  //       items: [
  //         {
  //           title: "useDriver",
  //           slug: "/react#use-driver",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Examples",
  //       slug: "/react#examples",
  //     },
  //   ],
  // },
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
      { title: "Usage", slug: "/from-matrix#usage" },
      { title: "Acknowledgements", slug: "/from-matrix#acknowledgments" },
    ],
  },
  // {
  //   title: "History",
  //   slug: "/history",
  // },
  // {
  //   title: "Comparisons",
  //   slug: "/comparisons",
  // },
  // {
  //   title: "Acknowledgements",
  //   slug: "/acknowledgements",
  // },
]

const slideIn = driver({ y: 90 }, { y: 0 }, { stiffness: 90, damping: 10, restDelta: 0.001 })

const scaleIn = driver(
  { scale: 0.7, opacity: 0 },
  { scale: 1, opacity: 1 },
  { stiffness: 150, damping: 10, restDelta: 0.001 }
)
const cssRule = `
@keyframes sprung { 
  ${slideIn.sprung} 
}

@keyframes tweened { 
  ${slideIn.tweened} 
}

.spring-up {
    animation-name: sprung, tweened;
    animation-duration: ${slideIn.duration};
    animation-timing-function: ${slideIn.ease};
    animation-fill-mode: both;
    display: block;
  }

  @keyframes scale-in { 
    ${scaleIn.sprung} 
  }
  
  @keyframes scale-in-fade { 
    ${scaleIn.tweened} 
  }
  
  .scale-in {
    animation: scale-in ${scaleIn.duration} ${scaleIn.ease} both, scale-in-fade 500ms ${scaleIn.ease} both;
    display: block;
  }
`

function MyApp({ Component, pageProps }: any) {
  return (
    <Layout items={items} version={pkg.version}>
      <Head>
        <title>Spring Keyframes Docs</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <style dangerouslySetInnerHTML={{ __html: cssRule }}></style>
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
