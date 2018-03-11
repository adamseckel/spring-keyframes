# Spring-Keyframes

#### Generate css keyframes in css-in-js based on a spring algorithm, with emotion: https://github.com/emotion-js/emotion.

---

Spring transform properties: `transformX`, `transformY`, `scale3d`, as `x`, `y`, and `scale`, as well as `opacity`.
The default export is wrapped in emotion's `keyframes`, however you can also export {spring} which returns a string to use with other css-in-js solutions.

### Example
This example is done for a react app, but can easoly work without react with `emotion`

```
import springKeyframes from 'spring-keyframes'
import styled from 'react-emotion'

const options = {
  stiffness: 0.8,
  damping: 0.5,
  precision: 2,
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

---

##### ToDo:

* Jest Tests,
* Snapshot Tests,
