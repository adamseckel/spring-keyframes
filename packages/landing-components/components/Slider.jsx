import * as React from 'react'
import styled from '@emotion/styled'

export const Slider = props => {
  return <StyledSlider type="range" {...props} />
}

const StyledSlider = styled.input`
  border-radius: 4px;
  background: var(--background);
  padding: 8px;
  color: var(--dark-text);
  font-size: 12px;
  font-weight: 600;
  border: 0;

  &:active,
  &:focus {
    outline: 0;
  }
`
