
export class MinValueCalculator {
  minValue = +Infinity;
  recalculate(value: number) {
    if (value < this.minValue) {
      this.minValue = value;
    }
    return this.minValue;
  }
  reset() {
    this.minValue = +Infinity;
  }
  get() {
    return this.minValue;
  }
}
