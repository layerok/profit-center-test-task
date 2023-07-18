import { observer } from "mobx-react-lite";
import { ChangeEvent, useRef } from "react";
import { useAppStore } from "../../stores/app.store";
import {
  QuotesStepper,
  SecondsStepper,
  useStepperStore,
} from "../../stores/stepper.store";
import * as S from "./Stepper.style";

export const Stepper = observer(() => {
  const appStore = useAppStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const stepperStore = useStepperStore();

  const steppers = [
    {
      key: "quotes",
      title: "котировки",
      resolveStepper: () =>
        new QuotesStepper({
          step: 10000,
          min: 2,
        }),
    },
    {
      key: "seconds",
      title: "секунды",
      resolveStepper: () =>
        new SecondsStepper({
          step: 10,
          min: 1,
        }),
    },
  ];

  const handleChangeStepType = (e: ChangeEvent<HTMLSelectElement>) => {
    const stepper = steppers.find(
      (stepper) => e.currentTarget.value === stepper.key
    );

    if (stepper) {
      const newStepper = stepper.resolveStepper();
      stepperStore.setStepper(newStepper);
      if (inputRef.current) {
        inputRef.current.value = String(newStepper.step);
      }
    }
  };

  const handleChangeStep = (event: ChangeEvent<HTMLInputElement>) => {
    stepperStore.stepper.setStep(Number(event.currentTarget.value));
  };

  return (
    <S.Stepper>
      <S.Input
        ref={inputRef}
        disabled={!appStore.isIdling}
        type="number"
        min={stepperStore.stepper.minStep}
        defaultValue={stepperStore.stepper.step}
        placeholder="Введите шаг"
        onChange={handleChangeStep}
      />
      <S.StepTypeSelect
        disabled={!appStore.isIdling}
        onChange={handleChangeStepType}
      >
        {steppers.map((stepper, i) => (
          <option key={stepper.key} value={stepper.key}>
            {stepper.title}
          </option>
        ))}
      </S.StepTypeSelect>
      {stepperStore.stepper.step < stepperStore.stepper.minStep && (
        <S.ErrorMsg>
          Шаг должен быть не меньше {stepperStore.stepper.minStep}
        </S.ErrorMsg>
      )}
    </S.Stepper>
  );
});
