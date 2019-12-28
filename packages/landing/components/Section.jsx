import { Row, Column } from 'emotion-box'
import styled from '@emotion/styled'
import * as React from 'react'
import { useInView } from 'react-hook-inview'

export const Section = ({ children, size, threshold = 0.5 }) => {
  const [ref, isVisible] = useInView({
    threshold,
    unobserveOnEnter: true,
  })

  return (
    <Container>
      <Row align="center" justify="center">
        <SectionColumn
          align="start"
          justify="start"
          ref={ref}
          size={size}
          style={{ height: 500 }}>
          {typeof children === 'function' ? children({ isVisible }) : children}
        </SectionColumn>
      </Row>
    </Container>
  )
}

const Container = styled('section')`
  height: 75vh;
  padding: 100px 0;
`

const SectionColumn = styled(Column)`
  max-width: ${props => (props.size === 'lg' ? '800px' : '660px')};
`

export const Subtitle = styled('h3')`
  font-size: 32px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 699;
  color: #757575;
  margin-bottom: 8px;
`

export const Title = styled('h2')`
  color: #ffffff;
  font-size: 36px;
  letter-spacing: 0px;
  line-height: 1.2;
  font-weight: 799;
`

export const Text = styled('p')`
  color: #757575;
  font-size: 20px;
  letter-spacing: 0px;
  line-height: 1.4;
  font-weight: 500;
  user-select: none;
  margin-top: 28px;
`
