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

const Overlay = styled.div`
  justify-items: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  z-index: 999999;
  position: fixed;
  inset: 0;
  overflow: auto;
`;

const Content = styled.div`
  border: none;
  border-radius: 0;
  position: relative;
  padding: 0;
  inset: 0;
  background: transparent;
  display: grid;
  justify-items: center;
`;

export { Container, Overlay, Content };
