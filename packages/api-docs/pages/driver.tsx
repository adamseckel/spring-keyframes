import * as React from "react"

import { TwoColumnCodeBlock } from "../components/CodeBlock"
import Head from "next/head"

export default function Introduction() {
  return (
    <>
      <Head>
        <title>Spring Keyframes Docs | Driver</title>
      </Head>
      <div id="driver">
        <h2>@spring-keyframes/driver</h2>
        <p>
          <b>driver</b> is a javascript function that generates a simple css{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes" rel="external">
            keyframe
          </a>{" "}
          animation from two frames based a physics-based spring algorithm.
        </p>
      </div>
      <div id="quick-start">
        <h3>Quick Start</h3>
        <TwoColumnCodeBlock code={`yarn add @spring-keyframes/driver`} lang={"null"}>
          <p>Install the driver with your favorite package manager, e.g.</p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <TwoColumnCodeBlock
          lang={"javascript"}
          code={`import { driver } from "@spring-keyframes/driver"

const animation = driver(
  { opacity: 0, x: 0, y: 0, scale: 1.2 }, 
  { opacity: 1, x: 100, y: -100, scale: 1 }, 
  options,
)`}>
          <p>
            Use <b>driver</b> in any place in which you want to generate a keyframes string. The function is invoked
            with three objects: a frame to animate from, a frame to animate to, and finally an optional configuration
            object. The from and to objects use a shorthand notation of <code>x</code>, <code>y</code>, <code>z</code>,
            in place of <code>translateX</code>, <code>translateY</code>, <code>translateZ</code>.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"

const { 
  duration,
  ease,
  resolveVelocity,
  sprung,
  tweened,
  inverted,
} = driver(...)`}>
          <p>
            Calls to <b>driver</b> return an object with properties required to create a css keyframe animation. They
            are the <code>duration</code> the animation should be run; the <code>ease</code> curve that should be used
            if the animation is not inverted; a string for each type of animation the driver can return:{" "}
            <code>sprung</code>, <code>tweened</code>, and <code>inverted</code>; and finally{" "}
            <code>resolveVelocity</code>, a function that when given a playtime in milliseconds, returns the approximate
            velocity at that time.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div id="examples">
        <h3>Examples</h3>
        <p>...</p>
      </div>
    </>
  )
}
