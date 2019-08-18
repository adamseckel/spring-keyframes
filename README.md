<img src="https://user-images.githubusercontent.com/9043345/41439555-26f827f0-7023-11e8-91e0-6396c9e3cd25.gif" alt="alt text" width="100%">

#### Generate css keyframes in css-in-js based on a spring algorithm, with emotion: https://github.com/emotion-js/emotion.

Spring transform properties: `transformX`, `transformY`, `scale3d`, as `x`, `y`, and `scale`, as well as `opacity`.

- The default export is wrapped in emotion's `keyframes`, however you can also export `{ spring }` which returns an array you can join and use with other css-in-js solutions. (I think...)

Note: for scale, be sure to use a higher precision, like 4.

### Example

This example is done for a react app, but can easily work without react with `emotion`

```
import spring from 'spring-keyframes'
import styled from 'react-emotion'

const options = {
  stiffness: 80,
  damping: 50,
  precision: 4,
  unit: 'px',
}

const Component = styled.div`
  animation: ${spring({
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
  }, options)} 300ms;
  animation-fill-mode: both;
`
```
