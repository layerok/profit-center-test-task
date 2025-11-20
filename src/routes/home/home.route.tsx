import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { DebugPanel } from "../../components/DebugPanel";
import {  useRef, useState } from "react";
import { Stepper } from "../../components/Stepper";
import { SecondaryButton } from "../../components/SecondaryButton";
import {IQuote, IStat} from "../../api";
import { PrimaryButton } from "../../components/PrimaryButton";
import { routePaths, WS_URL } from "../../constants";
import { useAddStat } from "../../hooks";
import { emitter } from "../../emitter";
import { ReactComponent as DebugIcon } from "../../assets/debug.svg";
import * as accumulateApproach from "../../approaches/accumulate";
import * as oneByOne from "../../approaches/oneByOne";

const MIN_STEP = 2;
const INITIAL_STEP = 10000;

enum AppStateEnum {
  Idling = "idling",
  Stopping = "stopping",
  Starting = "starting",
  Started = "started",
}

enum Approach  {
  OneByOne = 'oneByOne',
  Accumulate = 'accumulate'
}

const getCalculationApproach = (approach: Approach) => {
  switch(approach) {
    case Approach.OneByOne:
      return oneByOne;
    case Approach.Accumulate:
      return accumulateApproach;
    default:
      throw new Error('no approach found')
  }
}

export const HomeRoute = () => {
  const addStatMutation = useAddStat();
  const navigate = useNavigate();

  const calculationApproach = getCalculationApproach(Approach.Accumulate);

  const [debugPanelHidde, setDebugPanelHidden] = useState(false);

  const startCollectingQuotesTime = useRef<null | number>(null);

  const lastQuote = useRef<IQuote | null>(null);
  const lostQuotes = useRef<number>(0);

  const [step, setStep] = useState(INITIAL_STEP);
  const progress = useRef(0);

  const [state, setState] = useState<AppStateEnum>(AppStateEnum.Idling);

  const [ws, setWs] = useState<WebSocket | null>(null);

  const viewStats = () => {
    navigate(routePaths.statsList);
  };

  const handleStart = () => {
    startCollectingQuotesTime.current = Date.now();
    if (state === AppStateEnum.Idling) {
      emitter.emit("appStarting");
      setState(AppStateEnum.Starting);
      const ws = new WebSocket(WS_URL);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as IQuote;
        emitter.emit("quoteReceived", incomingQuote);
        onReceiveQuote(incomingQuote);
      };
      const onFail = () => {
        emitter.emit("appStopping");
        setState(AppStateEnum.Stopping);
      };
      const onClose = () => {
        emitter.emit("appStopped");
        setState(AppStateEnum.Idling);
      };
      const onOpen = (ev: Event) => {
        emitter.emit("appStarted");
        setState(AppStateEnum.Started);
      };

      ws.addEventListener("open", onOpen);
      ws.addEventListener("close", onClose);
      ws.addEventListener("fail", onFail);
      ws.addEventListener("message", onMessage);

      setWs(ws);
    }
  }

  const resetStats = () => {
    calculationApproach.resetState();

    lostQuotes.current = 0;
    lastQuote.current = null;
    progress.current = 0;
    startCollectingQuotesTime.current = null;
  }

  const onReceiveQuote = (incomingQuote: IQuote) => {
    calculationApproach.receiveQuote(incomingQuote);

    lastQuote.current = incomingQuote;
    if (lastQuote.current.id !== null) {
      lostQuotes.current += incomingQuote.id - lastQuote.current.id - 1;
    }

    if (!startCollectingQuotesTime.current) {
      startCollectingQuotesTime.current = Date.now();
    }

    progress.current++;

    const stat = computeStat();

    emitter.emit("statComputed", stat)

    const isTimeToSaveStat = progress.current === step;

    if (isTimeToSaveStat) {
      emitter.emit("statSaved", stat);
      addStatMutation.mutate(stat);
      progress.current = 0;
    }
  }

  const computeStat = () => {
    const startComputationTime = Date.now();

    const computed = calculationApproach.calculate()

    const endComputationTime = Date.now();

    const endTime = Date.now();

    const stat: Omit<IStat, "id"> = {
      avg: computed.avg,
      min_value: computed.minValue,
      max_value: computed.maxValue,
      mode: computed.mode,
      standard_deviation: computed.standardDeviation || 0,

      mode_count: computed.modeCount,
      even_values: computed.evenValuesCount,
      odd_values: computed.oddValuesCount,
      lost_quotes: lostQuotes.current,

      time_spent: endComputationTime - startComputationTime,
      start_time: startComputationTime,
      end_time: endTime,
      quotes_count: computed.quotesCount,
    };
    return stat;
  }

  const calculateStateBasedOnCurrentState = () => {
    const state = computeStat();
    addStatMutation.mutate(state);
    emitter.emit("statSaved", state);
  }


  const handleStop = () => {
    resetStats();
    if (!(state === AppStateEnum.Stopping) && !(state === AppStateEnum.Idling)) {
      emitter.emit("appStopping");
      setState(AppStateEnum.Stopping);
      ws?.close(1000);
      setWs(null);
    }
  }


  return (
    <S.Container>
      <main>
        <S.Inner>
          <div>
            <Stepper
              disabled={!(state === AppStateEnum.Idling)}
              minStep={MIN_STEP}
              step={step}
              onChange={setStep}
            />

            <S.ButtonContainer>
              <S.StartButton>
                <PrimaryButton
                  disabled={
                    step < MIN_STEP ||
                    state === AppStateEnum.Starting ||
                    state === AppStateEnum.Stopping
                  }
                  onClick={state === AppStateEnum.Idling ? handleStart: handleStop}
                >
                  {{
                    starting: "Starting...",
                    stopping: "Stopping...",
                    started: "Stop",
                    idling: "Start",
                  }[state]}
                </PrimaryButton>
              </S.StartButton>

              <S.StatsButton>
                <SecondaryButton onClick={viewStats}>
                  Статистика
                </SecondaryButton>
              </S.StatsButton>
              <S.StatsButton>
                <SecondaryButton onClick={calculateStateBasedOnCurrentState}>
                  Calculate right now
                </SecondaryButton>
              </S.StatsButton>
            </S.ButtonContainer>
          </div>
        </S.Inner>
        <DebugPanel onChangeVisibility={(visible) => setDebugPanelHidden(!visible)} isHidden={debugPanelHidde} />
        <S.Trigger
          onClick={() => {
            setDebugPanelHidden(prev => !prev)
          }}
        >
          <DebugIcon />
        </S.Trigger>
      </main>
      <Outlet />
    </S.Container>
  );
};

export const Component = HomeRoute;

Object.assign(Component, {
  displayName: "LazyHomeRoute",
});
