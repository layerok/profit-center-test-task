import { makeAutoObservable } from "mobx";
import { appConfig } from "../../config/app.config";
import { Quote } from "../Stats/types";
import { createNanoEvents, Emitter } from "nanoevents";

type Events = {
  quoteReceived: (quote: Quote) => void;
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
  totalQuotes = 0;
  lastQuoteId: number | null = null;
  statsComputedCount = 0;
  wsState: number = WebSocket.CLOSED;
  quotesLimit = 100;
  lostQuotes = 0;
  quoteValues: number[] = [];

  incrementTotalQuotes() {
    this.totalQuotes++;
  }

  incrementStatsComputedCount() {
    this.statsComputedCount++;
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

  get newlyReceivedQuotes() {
    return this.totalQuotes - this.statsComputedCount * this.quotesLimit;
  }

  setWsState(state: number) {
    this.wsState = state;
  }

  get isIdling() {
    return this.wsState === WebSocket.CLOSED;
  }

  get isStarting() {
    return this.wsState === WebSocket.CONNECTING;
  }

  get isStopping() {
    return this.wsState === WebSocket.CLOSING;
  }

  get isStarted() {
    return this.wsState === WebSocket.OPEN;
  }

  start() {
    if (!this.ws) {
      this.setWsState(WebSocket.CONNECTING);
      this.ws = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as Quote;
        this.emitter.emit("quoteReceived", incomingQuote);
      };
      const onFail = () => {
        this.setWsState(WebSocket.CLOSING);
      };
      const onClose = () => {
        this.setWsState(WebSocket.CLOSED);
      };
      const onOpen = (ev: Event) => {
        this.setWsState(WebSocket.OPEN);
      };

      this.ws.addEventListener("open", onOpen);
      this.ws.addEventListener("close", onClose);
      this.ws.addEventListener("fail", onFail);
      this.ws.addEventListener("message", onMessage);
    }
  }

  stop() {
    this.setWsState(WebSocket.CLOSING);
    this.ws?.close(1000);
    this.ws = null;
  }
}

export const appStore = new AppStore();

export const useAppStore = () => {
  return appStore;
};
