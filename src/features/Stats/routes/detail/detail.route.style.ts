import styled from "styled-components";

const Header = styled.header`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 700;
  margin-left: 12px;
`;

const Label = styled.div`
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Prop = styled.div`
  width: 103px;
  margin-right: 17px;
`

const Value = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Row = styled.div`
  display: flex;
`

const BackButtonContainer = styled.div`
  cursor: pointer;
`;

export { Header, Title, Label, Value, Row, Prop, BackButtonContainer };
