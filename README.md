# Spring-Keyframes

#### Generate css keyframes in css-in-js based on a spring algorithm, with emotion: https://github.com/emotion-js/emotion.

---
![spring 7](https://user-images.githubusercontent.com/9043345/37491197-eff0e8c6-2894-11e8-86ae-414533c4b8f4.gif)

Spring transform properties: `transformX`, `transformY`, `scale3d`, as `x`, `y`, and `scale`, as well as `opacity`.

* The default export is wrapped in emotion's `keyframes`, however you can also export `{ spring }` which returns an array you can join and use with other css-in-js solutions. (I think...)
* Requires an `Array.from` polyfill

Note: for scale, be sure to use a higher precision, like 4.

### Example

This example is done for a react app, but can easily work without react with `emotion`

```
import springKeyframes from 'spring-keyframes'
import styled from 'react-emotion'

const options = {
  stiffness: 0.8,
  damping: 0.5,
  precision: 4,
  unit: 'px',
}

const Component = styled.div`
  animation: ${springKeyframes({
    from: {
      opacity: 0,
      x: 0,
      scale: 0
    },
    to: {
      opacity: 1,
      x: 100,
      scale: 1
    }
  }, options)} 300ms linear 1;
`
```
