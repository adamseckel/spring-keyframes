import * as React from "react"

import { TwoColumnCodeBlock } from "../components/CodeBlock"
import Head from "next/head"

export default function Introduction() {
  return (
    <>
      <Head>
        <title>Spring Keyframes Docs | From-Matrix</title>
      </Head>
      <div id="driver">
        <h2>@spring-keyframes/from-matrix</h2>
        <p>
          <b>from-matrix</b> is a plain javascript function that transforms a{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d()" rel="external">
            transform matrix
          </a>{" "}
          into an object with the value of each independent transform function that composes that matrix.
        </p>
        <p>
          In practice, this unlocks the ability to determine exactly how an HTML element is being distorted by scale,
          rotation, or transforms, without sacrificing on bundle size, simply from querying the DOM.
        </p>
        <p>
          Gzipped, and excluding <code>tslib</code>, <b>@spring-keyframes/from-matrix</b> comes in at{" "}
          <b>
            <code>2.54kb</code>
          </b>
          .
        </p>
      </div>
      <div id="quick-start">
        <h3>Quick Start</h3>
        <TwoColumnCodeBlock code={`yarn add @spring-keyframes/from-matrix`} lang={"null"}>
          <p>Install from-matrix with your favorite package manager.</p>
        </TwoColumnCodeBlock>
      </div>
      <div id="usage">
        <h3>Usage</h3>
        <p>
          Use <b>fromMatrix</b> in any place in which you want extract independent transform functions from a transform
          matrix string.
        </p>
      </div>
      <div>
        <TwoColumnCodeBlock
          lang={"javascript"}
          code={`import { fromMatrix } from "@spring-keyframes/from-matrix"
const element = document.querySelector('#button')
const style = window.getComputedStyle(element)
const transforms = fromMatrix(style.transform)`}>
          <p>
            The function is called with the transform property of a <code>getComputedStyle()</code> transform.
          </p>
        </TwoColumnCodeBlock>
      </div>

      <div>
        <TwoColumnCodeBlock
          lang={"javascript"}
          code={`// transforms
// {
//  x: 10,
//  y: 10,
//  z: 10,
//  rotate: 20,
//  rotateX: 0,
//  rotateY: 0,
//  rotateZ: 20,
//  scaleX: 1.2
//  scale: 1.2,
//  scaleY: 1.2
//  scaleZ: 1
//  skew: 20,
//  skewX: 15,
//  skewY: 8,
// }
`}>
          <p>
            The return value includes the value of each transform function excluding perspective. <code>x</code>,{" "}
            <code>y</code>, <code>z</code>, <code>scale</code>, and <code>rotate</code> are included as shorthands
          </p>
        </TwoColumnCodeBlock>
      </div>

      <div id="acknowledgements">
        <h3>Acknowledgements</h3>
        <p>
          <b>@spring-keyframes/from-matrix</b> relies on the incredible work of{" "}
          <a rel="external" href="https://github.com/stassop">
            Stanislav Sopov
          </a>{" "}
          on{" "}
          <a rel="external" href="https://github.com/stassop/unmatrix">
            unmatrix
          </a>
          , as well as{" "}
          <a rel="external" href="https://github.com/pithumke">
            Pit Humke's
          </a>{" "}
          <a rel="external" href="https://github.com/pithumke/sylvester-es6">
            sylvester-es6
          </a>
          .
        </p>
        <p>
          <b>@spring-keyframes/from-matrix</b> only contribution is to cut down the size by removing unused functions,
          and refactor both of the above libraries to support typescript definitions. This is what allows{" "}
          <b>@spring-keyframes/from-matrix</b> to achieve a bundle size of <code>2.54kb</code>, whereas together{" "}
          <a rel="external" href="https://github.com/stassop/unmatrix">
            unmatrix
          </a>{" "}
          and{" "}
          <a rel="external" href="https://github.com/pithumke/sylvester-es6">
            sylvester-es6
          </a>{" "}
          together added around <code>125kb</code> to any bundle.
        </p>
      </div>
    </>
  )
}
