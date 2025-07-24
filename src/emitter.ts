import {createNanoEvents} from "nanoevents";
import {IQuote, IStat} from "./api";

type IEvents = {
  quoteReceived: (quote: IQuote) => void;
  appStopped: () => void;
  appStarted: () => void;
  appStopping: () => void;
  appStarting: () => void;
  statSaved: (stat: Omit<IStat, 'id'>) => void;
  statComputed: (stat: Omit<IStat, 'id'>) => void;
};
export const emitter = createNanoEvents<IEvents>();
