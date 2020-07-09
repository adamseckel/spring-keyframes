import * as React from 'react'
import styled from '@emotion/styled'

export const Slider = props => {
  return <StyledSlider type="range" {...props} />
}

const StyledSlider = styled.input`
  border-radius: 4px;
  background: #000;
  padding: 8px;
  color: #757575;
  font-size: 12px;
  font-weight: 600;
  border: 0;

  &:active,
  &:focus {
    outline: 0;
  }
`
