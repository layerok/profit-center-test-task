import { makeAutoObservable } from "mobx";
import { appConfig } from "../../../config/app.config";
import { Quote } from "../../Stats/types";
import { createNanoEvents, Emitter } from "nanoevents";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

type Events = {
  quoteReceived: (quote: Quote) => void;
};

enum AppStateEnum {
  Idling = "idling",
  Stopping = "stopping",
  Starting = "starting",
  Started = "started",
}

class AppStore {
  constructor() {
    makeAutoObservable(this, {
      emitter: false,
    });
    this.emitter = createNanoEvents<Events>();
  }
  emitter: Emitter<Events>;
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
      this.state = AppStateEnum.Starting;
      this.ws = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as Quote;
        this.emitter.emit("quoteReceived", incomingQuote);
      };
      const onFail = () => {
        this.setState(AppStateEnum.Stopping);
      };
      const onClose = () => {
        this.setState(AppStateEnum.Idling);
      };
      const onOpen = (ev: Event) => {
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
      this.state = AppStateEnum.Stopping;
      this.ws?.close(1000);
      this.ws = null;
    }
  }
}

export const appStore = new AppStore();

export const useAppStore = (): AppStore => {
  const ctx = useContext(MobXProviderContext);
  return ctx.appStore;
};
