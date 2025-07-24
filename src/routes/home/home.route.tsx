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

const MIN_STEP = 2;
const INITIAL_STEP = 10000;

enum AppStateEnum {
  Idling = "idling",
  Stopping = "stopping",
  Starting = "starting",
  Started = "started",
}

export const HomeRoute = () => {
  const addStatMutation = useAddStat();
  const navigate = useNavigate();
  const sum = useRef<number>(0);
  const quotesCount = useRef<number>(0);
  const avg = useRef<number>(0);
  const minValue = useRef<number>(+Infinity);
  const maxValue = useRef<number>(-Infinity);
  const evenValues = useRef<number>(0);
  const oddValues = useRef<number>(0);
  const lostQuotes = useRef<number>(0);
  const lastQuoteId = useRef<null | number>(0);
  const modeMap = useRef<Record<number, number>>({});
  const maxCount = useRef<number>(0);
  const mode = useRef< number>(0);
  const temp = useRef< number>(0);
  const standardDeviation = useRef< null | number>(null);
  const [debugPanelHidde, setDebugPanelHidden] = useState(true);

  const startTime = useRef<null | number>(null);
  const endTime = useRef<null | number>(null);

  const lastComputedStat = useRef<null | Omit<IStat, "id">>(null);

  const [step, setStep] = useState(INITIAL_STEP);
  const progress = useRef(0);

  const [state, setState] = useState<AppStateEnum>(AppStateEnum.Idling);

  const [ws, setWs] = useState<WebSocket | null>(null);

  const viewStats = () => {
    if (lastComputedStat.current) {
      addStatMutation.mutate(lastComputedStat.current);
      emitter.emit("statSaved", lastComputedStat.current);
    }
    navigate(routePaths.statsList);
  };

  const handleStart = () => {
    startTime.current = Date.now();
    if (state === AppStateEnum.Idling) {
      emitter.emit("appStarting");
      setState(AppStateEnum.Starting);
      const ws = new WebSocket(WS_URL);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as IQuote;
        emitter.emit("quoteReceived", incomingQuote);
        recomputeStats(incomingQuote)
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
    sum.current = 0;
    quotesCount.current = 0;
    avg.current = 0;
    minValue.current = +Infinity;
    maxValue.current = -Infinity;
    evenValues.current = 0;
    oddValues.current = 0;
    lastQuoteId.current = null;
    lostQuotes.current = 0;
    mode.current = 0;
    maxCount.current = 0;
    modeMap.current = {};
    sum.current = 0;
    avg.current = 0;
    quotesCount.current = 0;
    temp.current = 0;

    progress.current = 0;
  }

  const recomputeStats = (incomingQuote: IQuote) => {
    if (!startTime.current) {
      startTime.current = Date.now();
    }

    progress.current++;

    const startComputationTime = Date.now();

    quotesCount.current++;
    sum.current += incomingQuote.value;

    avg.current = sum.current / quotesCount.current;

    if (incomingQuote.value < minValue.current) {
      minValue.current = incomingQuote.value;
    }

    if (incomingQuote.value > maxValue.current) {
      maxValue.current = incomingQuote.value;
    }

    if (incomingQuote.value % 2 === 0) {
      evenValues.current++;
    }

    if (incomingQuote.value % 2 !== 0) {
      oddValues.current++;
    }

    if (lastQuoteId.current !== null) {
      lostQuotes.current += incomingQuote.id - lastQuoteId.current - 1;
    }

    lastQuoteId.current = incomingQuote.id;

    let count = modeMap.current[incomingQuote.value] || 0;
    modeMap.current[incomingQuote.value] = ++count;

    if (count > maxCount.current) {
      mode.current = incomingQuote.value;
      maxCount.current = count;
    }

    const diff = incomingQuote.value - avg.current;

    temp.current += diff * diff;

    if (quotesCount.current > 1) {
      standardDeviation.current = Math.sqrt(temp.current / (quotesCount.current - 1));
    }

    const computed = {
      minValue: minValue.current,
      maxValue: maxValue.current,
      mode: mode.current,
      avg: avg.current,
      standardDeviation: standardDeviation.current,
      modeCount: maxCount.current,
      evenValuesCount: evenValues.current,
      oddValuesCount: oddValues.current,
      lostQuotesCount: lostQuotes.current,
    };

    const endComputationTime = Date.now();

    endTime.current = Date.now();

    const stat: Omit<IStat, "id"> = {
      avg: computed.avg,
      min_value: computed.minValue,
      max_value: computed.maxValue,
      mode: computed.mode,
      standard_deviation: computed.standardDeviation || 0,

      mode_count: computed.modeCount,
      even_values: computed.evenValuesCount,
      odd_values: computed.oddValuesCount,
      lost_quotes: computed.lostQuotesCount,

      time_spent: endComputationTime - startComputationTime,
      start_time: startTime.current!,
      end_time: endTime.current,
      quotes_count: quotesCount.current,
    };

    emitter.emit("statComputed", stat)
    lastComputedStat.current = stat;
    const isTimeToSaveStat = progress.current === step;

    if (isTimeToSaveStat) {
      emitter.emit("statSaved", lastComputedStat.current);
      addStatMutation.mutate(stat);
      progress.current = 0;
    }
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
