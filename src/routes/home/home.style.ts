import styled from "styled-components";
import { media } from "../../lib/styled-components";

const Container = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
`;

const Inner = styled.div`
  width: 400px;
  position: relative;
  z-index: 2;
  ${media.lessThan("tablet")`
    width: 300px;
  `}
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 14px;
  justify-content: space-between;
  ${media.lessThan("tablet")`
    flex-direction: column;
  `}
`;

const StatsButton = styled.div`
  width: 190px;

  ${media.lessThan("tablet")`
    width: 100%;
    margin-top: 14px;
  `}
`;

const StartButton = styled.div`
  width: 190px;

  ${media.lessThan("tablet")`
    width: 100%;
    margin-top: 14px;
  `}
`;

export { Container, Inner, ButtonContainer, StatsButton, StartButton };
