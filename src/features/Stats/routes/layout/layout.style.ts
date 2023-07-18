import styled from "styled-components";
import { media } from "../../../../common/media";

const Container = styled.div`
  width: 520px;
  height: 359px;
  padding: 20px;
  position: relative;
  background: white;

  ${media.lessThan("tablet")`
    width: 100vw;
    overflow-y: auto;
  `}
`;

export { Container };
