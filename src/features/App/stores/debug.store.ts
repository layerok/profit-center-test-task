import { makeAutoObservable } from "mobx";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import * as mobxUtils from "mobx-utils";
import { IQuote, IStat } from "../../Stats/types";

class DebugStore {
  constructor() {
    makeAutoObservable(this);
  }

  panelHidden = true;
  reportsCreatedCount = 0;
  startTime: null | number = null;
  totalQuotesCount = 0;
  lastQuote: null | IQuote = null;
  lastStat: null | Omit<IStat, "id"> = null;

  hideDebugPanel() {
    this.panelHidden = true;
  }

  showDebugPanel() {
    this.panelHidden = false;
  }

  toggleDebugPanel() {
    this.panelHidden = !this.panelHidden;
  }

  incrementReportsCreatedCount() {
    this.reportsCreatedCount++;
  }

  setReportsCreatedCount(count: number) {
    this.reportsCreatedCount = count;
  }

  reset() {
    this.reportsCreatedCount = 0;
  }

  setLastStat(stat: Omit<IStat, "id">) {
    this.lastStat = stat;
  }

  get time() {
    if (this.startTime != null) {
      return mobxUtils.now() - this.startTime;
    }
    return 0;
  }

  get speed() {
    if (this.time !== 0) {
      return this.totalQuotesCount / (this.time / 1000);
    }
    return 0;
  }

  incrementTotalQuotesCount() {
    this.totalQuotesCount++;
  }

  setStartTime(time: number) {
    this.startTime = time;
  }

  setLastQuote(quote: IQuote) {
    this.lastQuote = quote;
  }
}

export const debugStore = new DebugStore();

export const useDebugStore = (): DebugStore => {
  const ctx = useContext(MobXProviderContext);
  return ctx.debugStore;
};
