import { styled } from "styled-components";

const CloseSvgContainer = styled.div`
  position: absolute;
  top: 22px;
  right: 32px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 700;
`;

const DataContainer = styled.div`
  overflow: auto;
  height: 275pxl;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 4px;
`;

export { CloseSvgContainer, Title, DataContainer, Row };
