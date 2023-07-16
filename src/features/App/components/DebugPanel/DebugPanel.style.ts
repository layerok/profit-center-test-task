import styled from "styled-components";
import { media } from "../../../../common/media";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 20px;
  color: white;
  background: rgba(28, 28, 28, 0.8);
  min-width: 180px;
  padding-bottom: 10px;
  ${media.lessThan("mobile")`
    width: 100%;
  `}
`;

const Stats = styled.div`
  text-align: right;
`;

const Stat = styled.div`
  display: flex;
  font-size: 10px;
  margin-top: 5px;
`;

const Label = styled.div`
  width: 220px;
`;

const Value = styled.div`
  margin-left: 2px;
`;

const HideButton = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  cursor: pointer;
`;

export { Container, Stats, Label, Value, Stat, HideButton };
