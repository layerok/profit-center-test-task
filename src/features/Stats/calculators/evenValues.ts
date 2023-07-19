
export class EvenValuesCalculator {
  evenValues = 0;
  recalculate(value: number) {
    if (value % 2 === 0) {
      this.evenValues++;
    }
    return this.evenValues;
  }
  reset() {
    this.evenValues = 0;
  }
  get() {
    return this.evenValues;
  }
}


