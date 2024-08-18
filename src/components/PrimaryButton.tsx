import styled from "styled-components";

export const PrimaryButton = styled.button`
  border: none;
  height: 45px;
  width: 100%;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  color: white;
  background-color: black;
  &:hover {
    opacity: 0.7;
  }
`
