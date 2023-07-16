import styled from "styled-components";
import { media } from "../../../../common/media";

const Button = styled.button`
  height: 45px;
  width: 190px;
  color: white;
  background-color: black;
  border: none;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  ${media.lessThan("tablet")`
    width: 100%;
  `}
`;

export { Button };
