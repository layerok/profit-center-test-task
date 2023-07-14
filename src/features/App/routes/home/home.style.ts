import styled from "styled-components";

const Container = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
`;

const Input = styled.input`
  border: 1px solid black;
  height: 46px;
  width: 100%;
  padding: 0 13px;
  font-size: 20px;
`;

const PrimaryButton = styled.button`
  height: 45px;
  width: 190px;
  color: white;
  background-color: black;
  border: none;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  border: none;
  height: 45px;
  width: 190px;
  cursor: pointer;
  color: black;
  &:hover {
    background: rgba(0,0,0,.06);
  }
`;


const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
`;

const ValidationMsg = styled.div`
  background: red;
  color: white;
  position: absolute;
  bottom: 100%;
  right: 0;
  font-size: 10px;
  padding: 4px;
`;

const InputContainer = styled.div`
  position: relative;
`

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 14px;
  justify-content: space-between;
`;

export {
  Container,
  Input,
  PrimaryButton,
  SecondaryButton,
  ControlsContainer,
  ValidationMsg,
  InputContainer,
  ButtonGroup
};
