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
import { useStatsStore } from "../../../Stats/stats.store";

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

  return (
    <S.Container>
      <main>
        <DebugPanel />
        <S.ControlsContainer>
          <S.InputContainer>
            <S.Input
              type="number"
              min="2"
              defaultValue={statsStore.step}
              placeholder="Кол-во котировок"
              onChange={(event) => {
                statsStore.setStep(+event.currentTarget.value);
              }}
            />
            {statsStore.step < 2 && (
              <S.ValidationMsg>
                Котировок должно быть не меньше двух
              </S.ValidationMsg>
            )}
          </S.InputContainer>
          <S.ButtonGroup>
            <S.PrimaryButton
              disabled={
                statsStore.step < 2 ||
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
