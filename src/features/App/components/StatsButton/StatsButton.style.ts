import styled from "styled-components";
import { media } from "../../../../common/media";

const Button = styled.button`
  background-color: transparent;
  border: none;
  height: 45px;
  width: 190px;
  cursor: pointer;
  color: black;
  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
  ${media.lessThan("tablet")`
    width: 100%;
    margin-top: 14px;
  `}
`;

export { Button };
