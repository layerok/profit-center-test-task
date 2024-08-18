import { ChangeEvent, useRef } from "react";
import styled from "styled-components";

export const Stepper = ({
  step: currentStep,
  minStep,
  onChange,
  disabled,
}: {
  step: number;
  minStep: number;
  onChange: (step: number) => void;
  disabled: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeStep = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.currentTarget.value));
  };

  return (
    <Root>
      <Input
        ref={inputRef}
        disabled={disabled}
        type="number"
        min={minStep}
        value={currentStep}
        placeholder="Введите шаг"
        onChange={handleChangeStep}
      />

      {currentStep < minStep && (
        <ErrorMsg>Шаг должен быть не меньше {minStep}</ErrorMsg>
      )}
    </Root>
  );
};

const ErrorMsg = styled.div`
  background: red;
  color: white;
  position: absolute;
  bottom: 100%;
  right: 0;
  font-size: 10px;
  padding: 4px;
`;

const Root = styled.div`
  position: relative;
  display: flex;
  height: 46px;
`;

const Input = styled.input`
  border: 1px solid black;
  height: 46px;
  padding: 0 13px;
  width: 100%;
  font-size: 20px;
  flex-grow: 1;
  &:disabled {
    border: 1px solid rgba(118, 118, 118, 0.3);
    opacity: 0.7;
  }
`;

