import { makeAutoObservable } from "mobx";
import { appConfig } from "../../../config/app.config";
import { IQuote } from "../../Stats/types";
import { createNanoEvents, Emitter } from "nanoevents";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

type IEvents = {
  quoteReceived: (quote: IQuote) => void;
  appStopped: () => void;
  appStarted: () => void;
  appStopping: () => void;
  appStarting: () => void;
};

enum AppStateEnum {
  Idling = "idling",
  Stopping = "stopping",
  Starting = "starting",
  Started = "started",
}

class AppStore {
  constructor() {
    makeAutoObservable<AppStore, "emitter">(this, {
      emitter: false,
      emit: false,
      on: false,
    });
    this.emitter = createNanoEvents<IEvents>();
  }
  private emitter: Emitter<IEvents>;
  ws: WebSocket | null = null;
  state: AppStateEnum = AppStateEnum.Idling;

  get isIdling() {
    return this.state === AppStateEnum.Idling;
  }

  get isStarting() {
    return this.state === AppStateEnum.Starting;
  }

  get isStopping() {
    return this.state === AppStateEnum.Stopping;
  }

  get isStarted() {
    return this.state === AppStateEnum.Started;
  }

  setState(state: AppStateEnum) {
    this.state = state;
  }

  start() {
    if (this.isIdling) {
      this.emitter.emit("appStarting");
      this.state = AppStateEnum.Starting;
      this.ws = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as IQuote;
        this.emitter.emit("quoteReceived", incomingQuote);
      };
      const onFail = () => {
        this.emitter.emit("appStopping");
        this.setState(AppStateEnum.Stopping);
      };
      const onClose = () => {
        this.emitter.emit("appStopped");
        this.setState(AppStateEnum.Idling);
      };
      const onOpen = (ev: Event) => {
        this.emitter.emit("appStarted");
        this.setState(AppStateEnum.Started);
      };

      this.ws.addEventListener("open", onOpen);
      this.ws.addEventListener("close", onClose);
      this.ws.addEventListener("fail", onFail);
      this.ws.addEventListener("message", onMessage);
    }
  }

  stop() {
    if (!this.isStopping && !this.isIdling) {
      this.emitter.emit("appStopping");
      this.state = AppStateEnum.Stopping;
      this.ws?.close(1000);
      this.ws = null;
    }
  }

  emit<E extends keyof IEvents>(event: E, ...args: Parameters<IEvents[E]>) {
    return this.emitter.emit(event, ...args);
  }

  on<E extends keyof IEvents>(event: E, callback: IEvents[E]) {
    return this.emitter.on(event, callback);
  }
}

export const appStore = new AppStore();

export const useAppStore = (): AppStore => {
  const ctx = useContext(MobXProviderContext);
  return ctx.appStore;
};
