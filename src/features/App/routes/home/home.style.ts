import styled from "styled-components";
import { media } from "../../../../common/media";

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
  ${media.lessThan("tablet")`
    width: 300px;
  `}
`;

const Container2 = styled.div`
  display: flex;
  margin-top: 14px;
  justify-content: space-between;
  ${media.lessThan("tablet")`
    flex-direction: column;
  `}
`;

export { Container, Inner, Container2 };
