import { makeAutoObservable } from "mobx";
import { appConfig } from "../../config/app.config";
import { Quote } from "../Stats/types";
import { createNanoEvents, Emitter } from "nanoevents";

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
      quoteValues: false,
      emitter: false,
    });
    this.emitter = createNanoEvents<Events>();
  }
  emitter: Emitter<Events>;
  ws: WebSocket | null = null;
  state: AppStateEnum = AppStateEnum.Idling;
  lastQuoteId: number | null = null;
  newQuotes = 0;
  quotesLimit = 100;
  lostQuotes = 0;
  quoteValues: number[] = [];


  incrementNewQuotes() {
    this.newQuotes++;
  }

  addQuoteValue(value: number) {
    this.quoteValues.push(value);
  }

  setLastQuoteId(id: number) {
    this.lastQuoteId = id;
  }

  setLostQuotes(count: number) {
    this.lostQuotes = count;
  }

  setQuotesLimit(limit: number) {
    this.quotesLimit = limit;
  }

  setState(state: AppStateEnum) {
    this.state = state;
  }

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

  start() {
    if (this.isIdling) {
      this.state = AppStateEnum.Starting;
      this.ws = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as Quote;
        this.emitter.emit("quoteReceived", incomingQuote);
      };
      const onFail = () => {
        this.state = AppStateEnum.Stopping;
      };
      const onClose = () => {
        this.state = AppStateEnum.Idling;
      };
      const onOpen = (ev: Event) => {
        this.state = AppStateEnum.Started;
      };

      this.ws.addEventListener("open", onOpen);
      this.ws.addEventListener("close", onClose);
      this.ws.addEventListener("fail", onFail);
      this.ws.addEventListener("message", onMessage);
    }
  }

  stop() {
    this.state = AppStateEnum.Stopping;
    this.ws?.close(1000);
    this.ws = null;
  }
}

export const appStore = new AppStore();

export const useAppStore = () => {
  return appStore;
};
