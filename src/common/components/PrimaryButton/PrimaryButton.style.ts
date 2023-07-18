import styled, { css } from "styled-components";
import { switchProp } from "styled-tools";

const Button = styled.button`
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
`;

export { Button };
