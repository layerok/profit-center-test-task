import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { useAddStat } from "../../../Stats/mutations";
import { useEffect } from "react";
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
      resolveStepper: () => new QuotesStepper(100, 2),
    },
    {
      key: "seconds",
      title: "секунды",
      resolveStepper: () => new SecondsStepper(10, 2),
    },
  ];

  return (
    <S.Container>
      <main>
        <DebugPanel />
        <S.ControlsContainer>
          <S.InputContainer>
            <S.Input
              type="number"
              min="2"
              value={statsStore.stepper.getStep()}
              placeholder="Введите шаг"
              onChange={(event) => {
                statsStore.stepper.setStep(+event.currentTarget.value);
              }}
            />
            <S.StepTypeSelect
              disabled={!appStore.isIdling}
              onChange={(e) => {
                const stepper = steppers.find(
                  (stepper) => e.currentTarget.value == stepper.key
                );

                if (stepper) {
                  statsStore.setStepper(stepper.resolveStepper())
                }
              }}
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
                Шаг должен быть не меньше {statsStore.stepper.getMinimumStep()}
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
              onClick={() => {
                if (appStore.isIdling) {
                  appStore.start();
                } else {
                  appStore.stop();
                }
              }}
            >
              {appStore.isIdling ? "Start" : ""}
              {appStore.isStarting ? "starting..." : ""}
              {appStore.isStarted ? "Stop" : ""}
              {appStore.isStopping ? "stopping..." : ""}
            </S.PrimaryButton>
            <S.SecondaryButton
              onClick={() => {
                if (statsStore.quoteValues.length > 2) {
                  statsStore.createStat(statsStore.quoteValues);
                }
                navigate(statsRoutePaths.list);
              }}
            >
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
