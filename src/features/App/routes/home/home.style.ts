import styled from "styled-components";

const Container = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 14px;
  justify-content: space-between;
`;

export {
  Container,
  Inner,
  ButtonGroup,
};
