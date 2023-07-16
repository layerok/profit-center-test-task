import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { useAddStat } from "../../../Stats/mutations";
import { ChangeEvent, useEffect, useRef } from "react";
import { Quote } from "../../../Stats/types";
import { useDebugStore } from "../../stores/debug.store";
import {
  QuotesStepper,
  SecondsStepper,
  useStatsStore,
} from "../../../Stats/stats.store";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();
  const debugStore = useDebugStore();
  const statsStore = useStatsStore();

  const navigate = useNavigate();

  const statMutation = useAddStat();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unbind = appStore.emitter.on("quoteReceived", (incomingQuote) => {
      debugStore.onQuoteReceived(incomingQuote);
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = statsStore.emitter.on("statCreated", (stat) => {
      debugStore.onStatCreated(stat);
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.emitter.on(
      "quoteReceived",
      (incomingQuote: Quote) => {
        statsStore.onQuoteReceived(incomingQuote);
      }
    );

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = statsStore.emitter.on("statCreated", (stat) => {
      statMutation.mutate(stat);
    });

    return () => unbind();
  });

  const steppers = [
    {
      key: "quotes",
      title: "котировки",
      resolveStepper: () =>
        new QuotesStepper(statsStore, {
          step: 100,
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

  const handleStart = () => {
    if (appStore.isIdling) {
      appStore.start();
    } else {
      appStore.stop();
    }
  };

  const handleStats = () => {
    if (statsStore.quoteValues.length > 2) {
      statsStore.createStat(statsStore.quoteValues);
    }
    navigate(statsRoutePaths.list);
  };

  const handleChangeStepType = (e: ChangeEvent<HTMLSelectElement>) => {
    const stepper = steppers.find(
      (stepper) => e.currentTarget.value == stepper.key
    );

    if (stepper) {
      const newStepper = stepper.resolveStepper();
      statsStore.setStepper(newStepper);
      if (inputRef.current) {
        inputRef.current.value = String(newStepper.getStep());
      }
    }
  };

  const handleChangeStep = (event: ChangeEvent<HTMLInputElement>) => {
    statsStore.stepper.setStep(+event.currentTarget.value);
  };

  return (
    <S.Container>
      <main>
        <DebugPanel />
        <S.ControlsContainer>
          <S.InputContainer>
            <S.Input
              ref={inputRef}
              disabled={!appStore.isIdling}
              type="number"
              min={statsStore.stepper.getMinimumStep()}
              defaultValue={statsStore.stepper.getStep()}
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
            {statsStore.stepper.getStep() <
              statsStore.stepper.getMinimumStep() && (
              <S.ValidationMsg>
                Шаг не должен быть не меньше{" "}
                {statsStore.stepper.getMinimumStep()}
              </S.ValidationMsg>
            )}
          </S.InputContainer>

          <S.ButtonGroup>
            <S.PrimaryButton
              disabled={
                statsStore.stepper.getStep() <
                  statsStore.stepper.getMinimumStep() ||
                appStore.isStarting ||
                appStore.isStopping
              }
              onClick={handleStart}
            >
              {appStore.isIdling ? "Start" : ""}
              {appStore.isStarting ? "starting..." : ""}
              {appStore.isStarted ? "Stop" : ""}
              {appStore.isStopping ? "stopping..." : ""}
            </S.PrimaryButton>
            <S.SecondaryButton onClick={handleStats}>
              Статистика
            </S.SecondaryButton>
          </S.ButtonGroup>
        </S.ControlsContainer>
      </main>
      <Outlet />
    </S.Container>
  );
});

export const Component = HomeRoute;
