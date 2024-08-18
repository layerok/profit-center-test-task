import styled from "styled-components";

export const SecondaryButton = styled.button`
  border: none;
  height: 45px;
  width: 100%;
  cursor: pointer;
  background: transparent;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  color: black;
  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`
