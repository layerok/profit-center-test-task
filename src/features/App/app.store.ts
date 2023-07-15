import { makeAutoObservable } from "mobx";
import { appConfig } from "../../config/app.config";
import { Quote } from "../Stats/types";

class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  webSocketInstance: WebSocket | null = null;
  totalQuotes = 0;
  lastQuoteId: number | null = null;
  statsComputedCount = 0;
  websocketState: number = WebSocket.CLOSED;
  quotesLimit = 100;
  lostQuotes = 0;

  incrementTotalQuotes() {
    this.totalQuotes++;
  }

  incrementStatsComputedCount() {
    this.statsComputedCount++;
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

  connectWebSocket({
    onQuoteRecieved,
  }: {
    onQuoteRecieved: (quote: Quote) => void;
  }) {
    if (!this.webSocketInstance) {
      this.setWebSocketState(WebSocket.CONNECTING);
      this.webSocketInstance = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const quote = JSON.parse(ev.data) as Quote;
        if (this.lastQuoteId !== null) {
          // I assume order of quotes is never violated,
          // so quote#5 can't come before quote#4
          const prevQuoteId = this.lastQuoteId;
          if (prevQuoteId + 1 !== quote.id) {
            this.setLostQuotes(this.lostQuotes + quote.id - (prevQuoteId + 1));
          }
        }
        this.lastQuoteId = quote.id;
        this.incrementTotalQuotes();

        onQuoteRecieved(quote);
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

  disconnectWebsocket() {
    this.setWebSocketState(WebSocket.CLOSING);
    this.webSocketInstance?.close(1000);
    this.setWebSocketInstance(null);
  }
}

export const appStore = new AppStore();

export const useAppStore = () => {
  return appStore;
};
