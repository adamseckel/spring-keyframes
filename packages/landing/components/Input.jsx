import * as React from 'react'
import styled from '@emotion/styled'

export const Input = props => {
  return <StyledInput {...props} />
}

const StyledInput = styled.input`
  border-radius: 8px;
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
