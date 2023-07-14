import { makeAutoObservable } from "mobx";
import { appConfig } from "../../config/app.config";
import { computeStatsFromQuotes } from "../Stats/computations/computeStatsFromQuotes";
import { Quote, Stat } from "../Stats/types";

class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  webSocketInstance: WebSocket | null = null;
  quotes: Quote[] = [];
  stats: Stat[] = [];
  websocketState: number = WebSocket.CLOSED;
  quotesLimit = 100;

  addQuote(quote: Quote) {
    this.quotes.push(quote);
  }

  addStat(stat: Stat) {
    this.stats.push(stat);
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

  connectWebSocket({ onComputeStat }: { onComputeStat: (stat: Stat) => void }) {
    if (!this.webSocketInstance) {
      this.setWebSocketState(WebSocket.CONNECTING);
      this.webSocketInstance = new WebSocket(appConfig.wsUrl);

      const onMessage = (ev: MessageEvent<string>) => {
        const quote = JSON.parse(ev.data) as Quote;
        this.addQuote(quote);
        if (
          this.quotes.length - this.stats.length * this.quotesLimit ===
          this.quotesLimit
        ) {
          const record = computeStatsFromQuotes(this.quotes);
          onComputeStat?.(record);
          this.addStat(record);
        }
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
