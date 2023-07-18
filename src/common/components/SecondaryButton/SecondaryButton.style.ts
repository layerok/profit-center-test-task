import styled, { css } from "styled-components";
import { switchProp } from "styled-tools";

const Button = styled.button`
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
`;

export { Button };
