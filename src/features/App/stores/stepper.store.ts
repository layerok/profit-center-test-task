import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { MobXProviderContext } from "mobx-react";
import { useContext } from "react";
import { IQuote } from "../../Stats/types";

type IStepperOptions = {
  step: number;
  min: number;
};

export class Stepper {
  step: number = 0;
  minStep: number = 0;

  constructor(options: IStepperOptions) {
    this.step = options.step;
    this.minStep = options.min;
    makeObservable<Stepper, "store">(this, {
      step: observable,
      setStep: action,
      minStep: observable,
      check: action,
      store: false,
    });
  }

  setStep(step: number) {
    this.step = step;
  }

  check(quote: IQuote): boolean {
    return false;
  }

  reset(): void {}
}

export class SecondsStepper extends Stepper {
  private secondsPassedAfterLastStatCreated = 0;
  private lastStatCreatedTimestamp: number | null = null;

  check(quote: IQuote) {
    if (!this.lastStatCreatedTimestamp) {
      this.lastStatCreatedTimestamp = Date.now();
    }
    this.secondsPassedAfterLastStatCreated =
      (Date.now() - this.lastStatCreatedTimestamp) / 1000;

    return this.secondsPassedAfterLastStatCreated >= this.step;
  }

  reset() {
    this.lastStatCreatedTimestamp = Date.now();
    this.secondsPassedAfterLastStatCreated = 0;
  }
}

export class QuotesStepper extends Stepper {
  private quotesReceivedAfterLastStatCreated = 0;

  check(quote: IQuote) {
    this.quotesReceivedAfterLastStatCreated++;

    return this.quotesReceivedAfterLastStatCreated === this.step;
  }

  reset() {
    this.quotesReceivedAfterLastStatCreated = 0;
  }
}

class StepperStore {
  stepper: Stepper;
  constructor() {
    makeAutoObservable(this);
    this.stepper = new QuotesStepper({
      step: 10000,
      min: 2,
    });
  }

  setStepper(stepper: Stepper) {
    this.stepper = stepper;
  }
}

export const stepperStore = new StepperStore();

export const useStepperStore = () => {
  const ctx = useContext(MobXProviderContext);
  return ctx.stepperStore as StepperStore;
};
