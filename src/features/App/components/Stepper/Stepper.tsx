import { ChangeEvent, useRef } from "react";

import * as S from "./Stepper.style";

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
    <S.Stepper>
      <S.Input
        ref={inputRef}
        disabled={disabled}
        type="number"
        min={minStep}
        value={currentStep}
        placeholder="Введите шаг"
        onChange={handleChangeStep}
      />

      {currentStep < minStep && (
        <S.ErrorMsg>Шаг должен быть не меньше {minStep}</S.ErrorMsg>
      )}
    </S.Stepper>
  );
};
