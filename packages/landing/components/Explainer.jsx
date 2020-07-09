import * as React from 'react'
import styled from '@emotion/styled'
import { Section, Subtitle, Title, Text } from './Section'
import { Row } from 'emotion-box'
import { animated } from '@spring-keyframes/react'
import { useState, useCallback } from 'react'
import { Visualizer } from './Visualizer'
import { Input } from './Input'
import { Slider } from './Slider'
import { Text as Label } from './Typography'
import { useDebounce } from '@react-hook/debounce'
import { useEffect } from 'react'

const animate = visible =>
  visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }

export const Explainer = ({}) => {
  return (
    <Section>
      {({ isVisible, wasVisible }) => (
        <>
          <Subtitle>What's the big deal.</Subtitle>
          <Title visible={isVisible}>
            Native CSS animations mean no slow down when the main thread is
            busy.
          </Title>

          <Text
            initial={{ opacity: 0, y: 50 }}
            animate={animate(wasVisible)}
            transition={{
              stiffness: 200,
              damping: 10,
              mass: 1,
              delay: 300,
            }}>
            Spring-keyframes calculates the minimum number of keyframes required
            to animate from one state to the next before the animation has even
            started. The native driver uses a custom cubic bezier curve to
            interpolate the rest.
          </Text>
          <Text
            initial={{ opacity: 0, y: 50 }}
            animate={animate(wasVisible)}
            transition={{
              stiffness: 200,
              damping: 10,
              mass: 1,
              delay: 400,
            }}>
            Once the animation begins, no javascript is required to keep it
            going. This means animations will always run smoothly and at full
            speed, regardless of how busy the main thread is.
          </Text>

          <Example
            initial={{ opacity: 0, y: 50 }}
            animate={animate(wasVisible)}
            transition={{
              stiffness: 200,
              damping: 10,
              mass: 1,
              delay: 500,
            }}>
            <ExampleStateContainer />
          </Example>
        </>
      )}
    </Section>
  )
}

const ExampleStateContainer = () => {
  const [options, setOptions] = useState({
    stiffness: 140,
    damping: 12,
    mass: 1,
    precision: 0.01,
  })

  const [debounced, setDebounced] = useDebounce(options)

  useEffect(() => setDebounced(options), [options])

  return (
    <>
      <InteractiveCanvas>
        <InteractiveElement
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 0 }}
          whileTap={{ scale: 1.4, rotate: 0 }}
          whileHover={{ rotate: 45, scale: 1 }}
          options={options}
          withInvertedScale>
          <div
            style={{
              width: 40,
              height: 40,
              background: '#141414',
              borderRadius: '100%',
            }}></div>
        </InteractiveElement>
      </InteractiveCanvas>
      <InteractiveControls>
        <Visualizer options={debounced} style={{ marginBottom: 24 }} />
        <TripleRow justify="space-between">
          <Label>Stiffness</Label>
          <Input
            type="number"
            value={options.stiffness}
            min={1}
            max={500}
            onChange={e =>
              setOptions({ ...options, stiffness: e.target.value })
            }
          />
          <Slider
            value={options.stiffness}
            min={1}
            max={500}
            onChange={e =>
              setOptions({ ...options, stiffness: e.target.value })
            }
          />
        </TripleRow>
        <TripleRow justify="space-between">
          <Label>Damping</Label>
          <Input
            type="number"
            value={options.damping}
            min={1}
            max={50}
            onChange={e => setOptions({ ...options, damping: e.target.value })}
          />
          <Slider
            value={options.damping}
            min={1}
            max={50}
            onChange={e => setOptions({ ...options, damping: e.target.value })}
          />
        </TripleRow>
        <TripleRow justify="space-between">
          <Label>Mass</Label>
          <Input
            type="number"
            value={options.mass}
            min={1}
            max={20}
            onChange={e => setOptions({ ...options, mass: e.target.value })}
          />
          <Slider
            value={options.mass}
            min={1}
            max={20}
            onChange={e => setOptions({ ...options, mass: e.target.value })}
          />
        </TripleRow>
      </InteractiveControls>
    </>
  )
}

const TripleRow = styled(Row)`
  > * {
    margin-right: 12px;
    width: 1px;
    flex-grow: 1;
  }
  > *:last-child {
    margin: 0;
  }
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
`
const Example = styled(animated.div)`
  border-radius: 8px;
  background: #141414;
  grid-column: 3 / span 8;
  margin-top: 36px;
  margin-left: -24px;
  margin-right: -24px;
  display: grid;
  grid-template-columns: auto repeat(8, 64px) auto;
  grid-gap: 24px;
`

const InteractiveCanvas = styled.div`
  width: 100%;
  height: 100%;
  grid-column: 1 / span 6;
  padding: 24px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const InteractiveElement = styled(animated.div)`
  width: 180px;
  height: 180px;
  background: #000;
  border-radius: 22%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const InteractiveControls = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  border-left: 1px solid #222;
  margin-left: -24px;
  grid-column: 7 / span 5;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
