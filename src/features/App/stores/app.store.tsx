import { appConfig } from "../../../config/app.config";
import { IQuote, IStat } from "../../Stats/types";
import { createNanoEvents, Unsubscribe } from "nanoevents";
import { createContext, ReactElement, useContext, useState } from "react";

type IEvents = {
  quoteReceived: (quote: IQuote) => void;
  appStopped: () => void;
  appStarted: () => void;
  appStopping: () => void;
  appStarting: () => void;
  statSaved: (stat: Omit<IStat, 'id'>) => void;
  statComputed: (stat: Omit<IStat, 'id'>) => void;
};

export enum AppStateEnum {
  Idling = "idling",
  Stopping = "stopping",
  Starting = "starting",
  Started = "started",
}

type IAppStore = {
  state: AppStateEnum;
  start: () => void;
  stop: () => void;
  on: <E extends keyof IEvents>(event: E, callback: IEvents[E]) => Unsubscribe;
  emit: <E extends keyof IEvents>(
    event: E,
    ...args: Parameters<IEvents[E]>
  ) => void;
};

export const AppContext = createContext<undefined | IAppStore>(undefined);

export const AppProvider = ({ children }: { children: ReactElement }) => {
  const [state, setState] = useState<AppStateEnum>(AppStateEnum.Idling);
  const [emitter] = useState(createNanoEvents<IEvents>());
  const [ws, setWs] = useState<WebSocket | null>(null);


  const start = () => {
    if (state === AppStateEnum.Idling) {
      emitter.emit("appStarting");
      setState(AppStateEnum.Starting);
      const ws = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as IQuote;
        emitter.emit("quoteReceived", incomingQuote);
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
  };

  const stop = () => {
    if (!(state === AppStateEnum.Stopping) && !(state === AppStateEnum.Idling)) {
      emitter.emit("appStopping");
      setState(AppStateEnum.Stopping);
      ws?.close(1000);
      setWs(null);
    }
  };

  const on = <E extends keyof IEvents>(event: E, callback: IEvents[E]) => {
    return emitter.on(event, callback);
  };

  const emit = <E extends keyof IEvents>(
    event: E,
    ...args: Parameters<IEvents[E]>
  ) => {
    return emitter.emit(event, ...args);
  };

  const ctx = {
    state,
    stop,
    start,
    on,
    emit,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};

export const useAppStore = (): IAppStore => {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("No AppContext.Provider found when calling useAppStore.");
  return ctx;
};
