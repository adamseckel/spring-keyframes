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
    title: "Quick Start",
    slug: "/quick-start",
    items: [
      { title: "@spring-keyframes/react", slug: "/quick-start#react" },
      { title: "@spring-keyframes/driver", slug: "/quick-start#driver" },
      { title: "@spring-keyframes/from-matrix", slug: "/quick-start#from-matrix" },
    ],
  },
  {
    title: "API",
    slug: "/api",
    items: [
      {
        title: "@spring-keyframes/react",
        slug: "/api#react",
        items: [
          {
            title: "Animated",
            slug: "/api#animated",
          },
          {
            title: "CorrectDistortion",
            slug: "/api#correct-distortion",
          },
          {
            title: "AnimateExit",
            slug: "/api#animate-exit",
          },
          {
            title: "Keyframes",
            slug: "/api#keyframes",
          },
        ],
      },
      { title: "@spring-keyframes/driver", slug: "/api#driver" },
      { title: "@spring-keyframes/from-matrix", slug: "/api#from-matrix" },
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
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
