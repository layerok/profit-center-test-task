import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  color: white;
  background: rgba(28, 28, 28, 0.8);
  width: 170px;
  padding-bottom: 10px;
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
  width: 100px;
  
`;

const Value = styled.div`
  margin-left: 2px;
`;

export { Container, Stats, Label, Value, Stat };
