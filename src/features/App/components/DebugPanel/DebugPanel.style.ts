import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  color: white;
  background: rgba(28, 28, 28, 0.8);
  width: 150px;
  padding-bottom: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const Stat = styled.div`
  display: flex;
  font-size: 10px;
  margin-top: 3px;
`;

const Stats = styled.div`
  margin-top: 8px;
`;

const Label = styled.div`
  width: 100px;
  
`;

const Value = styled.div`
  margin-left: 2px;
`;

export { Title, Container, Stats, Label, Value, Stat };
