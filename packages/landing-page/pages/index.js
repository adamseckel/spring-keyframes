import Head from "next/head"
import styles from "../styles/Home.module.css"
import { Animate, CorrectLayoutDistortion, AnimatePresence } from "@spring-keyframes/react"
import * as React from "react"

export default function Home() {
  const [toggled, setToggled] = React.useState(false)
  const [visible, setVisible] = React.useState(true)

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <Animate whilePress={{ scale: 1.2 }} style={{ width: 200, height: 200, background: "red" }} /> */}
        <AnimatePresence>
          {visible && (
            <Animate
              key="A"
              id="A"
              layout
              onClick={() => setVisible(!visible)}
              enterFrom={{ opacity: 0 }}
              exitTo={{ opacity: 0 }}
              style={{ width: 300, height: 300, backgroundColor: "black" }}
            />
          )}
          <Animate
            as="div"
            layout
            key="B"
            id="PARENT"
            onClick={() => setToggled(!toggled)}
            style={{
              background: "blue",
              width: toggled ? 600 : 800,
              height: toggled ? 300 : 200,
            }}
            enterFrom={{ opacity: 0, scale: 1.2 }}>
            <CorrectLayoutDistortion style={{ transformOrigin: "0% 0% 0" }}>
              <Animate
                id="CHILD"
                key="CHILD"
                layout
                style={{
                  background: "red",
                  width: 200,
                  height: 200,
                  width: toggled ? 400 : 600,
                  height: toggled ? 100 : 150,
                }}>
                <CorrectLayoutDistortion style={{ transformOrigin: "50% 0% 0" }}>
                  <h1 className={styles.title} style={{ fontSize: 18 }}>
                    Welcome to Next.js!
                  </h1>
                </CorrectLayoutDistortion>
              </Animate>
            </CorrectLayoutDistortion>
          </Animate>

          <Animate layout as="div" key="C">
            <p className={styles.description}>
              Get started by editing <code className={styles.code}>pages/index.js</code>
            </p>

            <div className={styles.grid}>
              <a href="https://nextjs.org/docs" className={styles.card}>
                <h3>Documentation &rarr;</h3>
                <p>Find in-depth information about Next.js features and API.</p>
              </a>

              <a href="https://nextjs.org/learn" className={styles.card}>
                <h3>Learn &rarr;</h3>
                <p>Learn about Next.js in an interactive course with quizzes!</p>
              </a>

              <a href="https://github.com/vercel/next.js/tree/master/examples" className={styles.card}>
                <h3>Examples &rarr;</h3>
                <p>Discover and deploy boilerplate example Next.js projects.</p>
              </a>

              <a
                href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                className={styles.card}>
                <h3>Deploy &rarr;</h3>
                <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
              </a>
            </div>
          </Animate>
        </AnimatePresence>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
