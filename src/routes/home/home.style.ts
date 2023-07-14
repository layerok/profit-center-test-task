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
  width: 228px;
  padding: 0 13px;
  font-size: 20px;
`;

const PrimaryButton = styled.button`
  height: 45px;
  width: 228px;
  color: white;
  background-color: black;
  border: none;
  font-size: 26px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const SecondaryButton = styled.button`
  background-color: #eaf5ff;
  border: none;
  height: 45px;
  width: 161px;
  color: #5891ff;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const StatsButtonContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 13px;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export {
  Container,
  Input,
  PrimaryButton,
  SecondaryButton,
  ControlsContainer,
  StatsButtonContainer,
};
