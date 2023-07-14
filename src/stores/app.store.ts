import { makeAutoObservable } from "mobx";
import { Quote, Stat } from "../types";

class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  quotes: Quote[] = [];
  stats: Stat[] = [];
  websocketState: number = WebSocket.CLOSED;

  addQuote(quote: Quote) {
    this.quotes.push(quote);
  }

  addStat(stat: Stat) {
    this.stats.push(stat);
  }

  setWebSocketState(state: number) {
    this.websocketState = state;
  }
}

export const appStore = new AppStore();