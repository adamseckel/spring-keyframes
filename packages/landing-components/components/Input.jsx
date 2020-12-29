import * as React from 'react'
import styled from '@emotion/styled'

export const Input = props => {
  return <StyledInput {...props} />
}

const StyledInput = styled.input`
  border-radius: 8px;
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
