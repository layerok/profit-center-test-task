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
  height: 24px;
`;

const Prop = styled.div`
  width: 103px;
  margin-right: 17px;
`;

const Value = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const FirstRow = styled.div`
  display: flex;
  margin-top: 38px;
`;

const SecondRow = styled.div`
  display: flex;
  margin-top: 48px;
`;

const ThirdRow = styled.div`
  display: flex;
  margin-top: 27px;
`;

const BackButtonContainer = styled.div`
  cursor: pointer;
`;

export {
  Header,
  Title,
  Label,
  Value,
  FirstRow,
  Prop,
  BackButtonContainer,
  SecondRow,
  ThirdRow,
};
