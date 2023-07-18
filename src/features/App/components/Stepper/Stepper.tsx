import { observer } from "mobx-react-lite";
import { ChangeEvent, useRef } from "react";
import {
  QuotesStepper,
  SecondsStepper,
  useStatsStore,
} from "../../../Stats/stores/stats.store";
import { useAppStore } from "../../stores/app.store";
import * as S from "./Stepper.style";

export const Stepper = observer(() => {
  const statsStore = useStatsStore();
  const appStore = useAppStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const steppers = [
    {
      key: "quotes",
      title: "котировки",
      resolveStepper: () =>
        new QuotesStepper(statsStore, {
          step: 10000,
          min: 2,
        }),
    },
    {
      key: "seconds",
      title: "секунды",
      resolveStepper: () =>
        new SecondsStepper(statsStore, {
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
      statsStore.setStepper(newStepper);
      if (inputRef.current) {
        inputRef.current.value = String(newStepper.step);
      }
    }
  };

  const handleChangeStep = (event: ChangeEvent<HTMLInputElement>) => {
    statsStore.stepper.setStep(Number(event.currentTarget.value));
  };

  return (
    <S.Stepper>
      <S.Input
        ref={inputRef}
        disabled={!appStore.isIdling}
        type="number"
        min={statsStore.stepper.minStep}
        defaultValue={statsStore.stepper.step}
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
      {statsStore.stepper.step < statsStore.stepper.minStep && (
        <S.ErrorMsg>
          Шаг должен быть не меньше {statsStore.stepper.minStep}
        </S.ErrorMsg>
      )}
    </S.Stepper>
  );
});
