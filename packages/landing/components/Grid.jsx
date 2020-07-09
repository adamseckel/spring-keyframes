import * as React from 'react'
import styled from '@emotion/styled'

export const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 64px);
  grid-column-gap: 24px;
  justify-content: center;
  width: 100%;
`

export const GridContainer = styled(ColumnGrid)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  z-index: 0;
`

const GridItem = styled.div`
  border: 0;
  border-left: 1px dashed #222222;
  border-right: 1px dashed #222222;
  height: 100%;
  width: 100%;
`

const items = Array(12).fill('')

export const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  justify-content: stretch;
`

export const Grid = () => (
  <GridContainer>
    {items.map((_, i) => (
      <GridItem key={i} />
    ))}
  </GridContainer>
)
