import * as React from "react"

import { TwoColumnCodeBlock } from "../components/CodeBlock"
import Head from "next/head"
import Link from "next/link"

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
          animation from two frames based on{" "}
          <a href="https://github.com/Popmotion/popmotion/tree/master/packages/popmotion" rel="external">
            popmotion
          </a>
          's physics-based spring algorithm.
        </p>
      </div>
      <div id="quick-start">
        <h3>Quick Start</h3>
        <TwoColumnCodeBlock code={`yarn add @spring-keyframes/driver`} lang={"null"}>
          <p>Install the driver with your favorite package manager.</p>
          <p>
            If you are already using{" "}
            <Link href={"/react"}>
              <a>@spring-keyframes/react</a>
            </Link>{" "}
            you can skip this step. The driver is included.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div id="quick-start">
        <h3>Usage</h3>
        <p>
          Use <b>driver</b> in any place in which you want to generate a keyframes string.
        </p>
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
            The function is invoked with three objects: a frame to animate from, a frame to animate to, and finally an
            optional configuration object.
          </p>
          <p>
            The from and to objects use a shorthand notation of <code>x</code>, <code>y</code>, <code>z</code>, in place
            of <code>translateX</code>, <code>translateY</code>, <code>translateZ</code>.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"

const { 
  duration,
  ease,
  sprung,
  tweened,
  inverted,
  resolveVelocity,
} = driver(...)`}>
          <p>
            Calls to <b>driver</b> return an object with properties required to create a css keyframe animation.
          </p>
          <p>
            {" "}
            They are the <code>duration</code> the animation should be run; the <code>ease</code> curve that should be
            used if the animation is not inverted; a string for each type of animation the driver can return:{" "}
            <code>sprung</code>, <code>tweened</code>, and <code>inverted</code>; and finally{" "}
            <code>resolveVelocity</code>, a function that when given a playtime in milliseconds, returns the approximate
            velocity at that time.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"
import { css } from "linaria"

const { duration, ease, sprung } = driver(...)

const animated = css\`
  @keyframes spring-in { \${sprung} }

  animation: spring-in \${ease} \${duration}
\``}>
          <p>
            Finally, use the return values from calls to <b>driver</b> to build a <code>@keyframes</code> declaration.
          </p>
          <p>
            Use <code>ease</code> and <code>duration</code> along with the name of your <code>@keyframes</code>{" "}
            animation to create a css animation.
          </p>
          <p>
            In this example we use{" "}
            <a href="https://github.com/callstack/linaria" rel="external">
              Linaria
            </a>
            's css function to create a statically generated, physics-based spring animation.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"
import { css } from "linaria"

const { duration, ease, sprung, tweened } = driver(..., {
  tweened: ["scale"]
})

const animated = css\`
  @keyframes spring-in { \${sprung} }
  @keyframes tween-in { \${tweened} }

  animation: spring-in \${ease} \${duration},
    tween-in linear \${duration * 0.8}
\``}>
          <p>
            Some animations will include properties that are not animated based on the spring. By default, these
            properties are <code>opacity</code>, <code>color</code>, <code>background</code>, and{" "}
            <code>backgroundColor</code>
          </p>
          <p>
            To tween different properties, pass an array of the camel-cased css properties you wish to be tweened when
            invoking <code>driver</code> as <code>options.tweened</code>.
          </p>
          <p>
            These properties will be tweened with a normal, separate <code>@keyframes</code> animation. If you are
            animating any of these properties, it's important to include this animation as well. This allows easy
            control over properties such as <code>duration</code> (often these animations should finish a bit sooner
            than spring animations, which quickly reach the target value, then oscillate around it), as well as the{" "}
            <code>animation-timing-function</code>.
          </p>
        </TwoColumnCodeBlock>
      </div>

      <div id="options">
        <h3>Options</h3>
        <p>
          <b>driver</b> can be invoked with an optional configuration object that allows you to determine how the
          keyframe animations are generated. This configuration object directly extends{" "}
          <a href="https://github.com/Popmotion/popmotion/tree/master/packages/popmotion" rel="external">
            popmotion
          </a>
          's <code>SpringOptions</code>, omitting <code>from</code>, and <code>to</code> (which are the first two
          arguments of <code>driver</code>).
        </p>
        <p>
          Check out the excellent description of how these options impact a spring over in the{" "}
          <a href="https://popmotion.io/#quick-start-animation-animate-spring-options" rel="external">
            popmotion docs
          </a>
          .
        </p>
      </div>

      <div id="examples">
        <h3>Examples</h3>
        <p>
          <b>driver</b> is primarily useful when paired with your favorite flavor of css-in-js library.
        </p>
        <p>
          This can be runtime solutions, like{" "}
          <a href="https://github.com/emotion-js/emotion" rel="external">
            Emotion
          </a>{" "}
          or{" "}
          <a href="https://github.com/styled-components/styled-components" rel="external">
            styled-components
          </a>
          , or even better, compile time solutions like{" "}
          <a href="https://github.com/callstack/linaria" rel="external">
            Linaria
          </a>{" "}
          or{" "}
          <a href="https://github.com/seek-oss/treat" rel="external">
            Treat
          </a>
          .
        </p>
      </div>
      <div>
        <h4>Emotion</h4>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"
import { css, keyframes } from '@emotion/react'

const { duration, ease, sprung } = driver(...)

const spring = keyframes\`
  \${sprung}
\`

const animation = css\`
  animation: \${spring} \${duration} \${ease};
\``}>
          <p>
            <a href="https://github.com/callstack/linaria" rel="external">
              Emotion
            </a>{" "}
            exports a <code>keyframes</code> function that allows you to inject a css <code>@keyframes</code>{" "}
            declaration with css-in-js. You can then consume the animation with the <code>css</code> function, or
            alternatively the <code>styled</code> function.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <h4>styled-components</h4>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"
import styled, { keyframes } from 'styled-components'

const { duration, ease, sprung } = driver(...)

const spring = keyframes\`
  \${sprung}
\`

const AnimatedButton = styled.div\`
  animation: \${duration} \${spring} \${ease};
\``}>
          <p>
            <a href="https://github.com/callstack/linaria" rel="external">
              styled-components
            </a>{" "}
            can be used with practically the same api as{" "}
            <a href="https://github.com/callstack/linaria" rel="external">
              Emotion
            </a>
            . The only difference is that <b>styled-components</b> is limited to using the <code>styled</code> function.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <h4>Linaria</h4>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"
import { css } from "linaria"

const { duration, ease, sprung } = driver(...)

export const animated = css\`
  @keyframes spring-in { \${sprung} }

  animation: spring-in \${ease} \${duration}
\``}>
          <p>
            <a href="https://github.com/callstack/linaria" rel="external">
              Linaria
            </a>{" "}
            automatically generates a <code>@keyframes</code> declaration with a guaranteed unique name when a{" "}
            <code>@keyframes</code> animation is included inside the <code>css</code> function.
          </p>
        </TwoColumnCodeBlock>
      </div>
      <div>
        <h4>Treat</h4>
        <TwoColumnCodeBlock
          code={`import { driver } from "@spring-keyframes/driver"
import { style } from 'treat'

const { duration, ease, sprung } = driver(...)

export const animation = style({
  '@keyframes': sprung,
  animationTimingFunction: ease,
  animationDuration: duration,
})`}>
          <p>
            <a href="https://github.com/callstack/linaria" rel="external">
              Treat
            </a>{" "}
            automatically creates a unique name for any <code>'@keyframes'</code> properties and assigns it as the
            declarations <code>animation-name</code>, allowing you to simply specify the keyframes animation, the timing
            function, and the duration.
          </p>
        </TwoColumnCodeBlock>
      </div>
    </>
  )
}
