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
      emitter: false
    });
    this.emitter = createNanoEvents<Events>();
  }
  emitter: Emitter<Events>;
  webSocketInstance: WebSocket | null = null;
  totalQuotes = 0;
  lastQuoteId: number | null = null;
  statsComputedCount = 0;
  websocketState: number = WebSocket.CLOSED;
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

  setWebSocketState(state: number) {
    this.websocketState = state;
  }

  setWebSocketInstance(instance: WebSocket | null) {
    this.webSocketInstance = instance;
  }

  setQuotesLimit(limit: number) {
    this.quotesLimit = limit;
  }

  get newlyReceivedQuotes() {
    return this.totalQuotes - this.statsComputedCount * this.quotesLimit;
  }

  get isIdle() {
    return appStore.websocketState === WebSocket.CLOSED;
  }

  startListeningForQuotes() {
    if (!this.webSocketInstance) {
      this.setWebSocketState(WebSocket.CONNECTING);
      this.webSocketInstance = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const incomingQuote = JSON.parse(ev.data) as Quote;
        if (this.lastQuoteId !== null) {
          // I assume the order of quotes is never violated,
          // so quote#5 can't come before quote#4
          if (this.lastQuoteId + 1 !== incomingQuote.id) {
            this.setLostQuotes(
              this.lostQuotes + incomingQuote.id - (this.lastQuoteId + 1)
            );
          }
        }
        this.setLastQuoteId(incomingQuote.id);
        this.incrementTotalQuotes();
        this.addQuoteValue(incomingQuote.value);
        this.emitter.emit('quoteReceived', incomingQuote)
      };
      const onFail = () => {
        this.setWebSocketState(WebSocket.CLOSING);
      };
      const onClose = () => {
        this.setWebSocketState(WebSocket.CLOSED);
      };
      const onOpen = (ev: Event) => {
        this.setWebSocketState(WebSocket.OPEN);
      };

      this.webSocketInstance.addEventListener("open", onOpen);
      this.webSocketInstance.addEventListener("close", onClose);
      this.webSocketInstance.addEventListener("fail", onFail);
      this.webSocketInstance.addEventListener("message", onMessage);
    }
  }

  endListeningForQuotes() {
    this.setWebSocketState(WebSocket.CLOSING);
    this.webSocketInstance?.close(1000);
    this.setWebSocketInstance(null);
  }
}

export const appStore = new AppStore();

export const useAppStore = () => {
  return appStore;
};
