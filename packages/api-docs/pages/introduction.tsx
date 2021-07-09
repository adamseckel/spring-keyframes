import * as React from "react"
import Link from "next/link"
import Head from "next/head"

export default function Introduction() {
  return (
    <>
      <Head>
        <title>Spring Keyframes Docs | Introduction</title>
      </Head>
      <div id="introduction">
        <h2>Introduction</h2>
        <p>
          <b>spring keyframes</b> is a set of tools that enables running natural spring-based animations in the browser
          without relying on javascript to update the animation on every frame.
        </p>
      </div>
      <div id="how-it-works">
        <h3>How It Works</h3>
        <p>
          <b>spring keyframes</b> is built around{" "}
          <Link href="/driver">
            <a>@spring-keyframes/driver</a>
          </Link>{" "}
          , a function that is capable of generating the minimum number of{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes" rel="external">
            css keyframes
          </a>{" "}
          required to animate a set of values from a to b, based on whatever spring settings it is configured with.
        </p>
        <p>
          This output can be used to generate static keyframes that can be generated at build time when paired with a
          static css-in-js tool like{" "}
          <a href="https://github.com/callstack/linaria" rel="external">
            Linaria
          </a>{" "}
          or{" "}
          <a href="https://github.com/seek-oss/vanilla-extract" rel="external">
            Vanilla Extract
          </a>
          , or at runtime when paired with other tools like{" "}
          <a href="https://github.com/emotion-js/emotion" rel="external">
            Emotion
          </a>{" "}
          while only adding{" "}
          <b>
            <a href="https://bundlephobia.com/package/@spring-keyframes/driver@0.0.52" rel="external">
              <code>3.1kb</code>
            </a>
          </b>{" "}
          of bundle-size.
        </p>
        {/* <p>
          Finally this output can also be used to generate animations "just-in-time". It's this ability that powers{" "}
          <Link href="/react">
            <a>@spring-keyframes/react</a>
          </Link>
          .
        </p> */}
        {/* <p>
          None of this would be possible without{" "}
          <Link href="/from-matrix">
            <a>@spring-keyframes/from-matrix</a>
          </Link>{" "}
          which delivers the ability to extract individual transform function values from a transform matrix string,
          while only adding{" "}
          <b>
            <code>1.4kb</code>
          </b>{" "}
          to the bundle size, allowing animations to be smoothly interrupted.
        </p> */}
      </div>
      <div id="benefits">
        <h3>Benefits</h3>
        <p>
          These tools are not the best fit for many situations. For instance, it is impractical to perform drag
          interactions with keyframes, and so this sort of functionality is not provided. If you need to animate
          real-time manipulation, like dragging, panning, or scrolling, I highly recommend{" "}
          <a href="https://github.com/framer/motion" rel="external">
            framer-motion
          </a>
          .
        </p>
        <p>
          <Link href="/driver">
            <a>@spring-keyframes/driver</a>
          </Link>{" "}
          {/* and{" "}
          <Link href="/react">
            <a>@spring-keyframes/react</a>
          </Link>{" "} */}
          excels in situations where the product demands smooth animations even when the web page is busy, something
          that other animation libraries like <b>framer-motion</b> and <b>react-spring</b> cannot accomplish due to
          being dependent on the browser having the capacity to schedule an animation frame every 16ms.
        </p>
        <p>
          <Link href="/driver">
            <a>@spring-keyframes/driver</a>
          </Link>{" "}
          is particularly useful when you have an uninterrupted animation that will always play from one set value to
          another. In this case, you can use spring-keyframes with a static site generator and bake the animation into
          the markup of the site. No javascript will be required and you will be able to perform a physics-based
          animation on anything from a static site, to a PWA. Even when the animation plays, it will have no impact on
          the rest of the site or app, regardless of how much stress the browser is already under.
        </p>
        {/* <p>
          <Link href="/driver">
            <a> @spring-keyframes/react</a>
          </Link>{" "}
          on the other hand is particularly useful when you want to perform animations with dynamic or user-defined
          start or end points but you can't be sure that your application will have the cpu bandwidth to calculate a new
          frame every 16ms to ensure the animation does not pause, skip or catch-up. This can easily happen if you
          require an animation to play when a site loads when the browser is generally busy parsing and executing a
          javascript bundle, or any other time that an animation will be performed when other cpu-intensive tasks are
          being executed.
        </p> */}
      </div>
    </>
  )
}
