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
  margin-top: 20px;
  overflow: auto;
  height: 265px;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 4px;
`;

const ID = styled.div`
  min-width: 75px;
`;

const Date = styled.div`
  min-width: 200px;
  margin-left: 10px;
`;

const Action = styled.div`
  margin-left: 10px;
`;

export { CloseSvgContainer, Title, DataContainer, Row, ID, Date, Action };
