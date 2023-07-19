export class MaxValueCalculator {
  maxValue = -Infinity;
  recalculate(value: number) {
    if (value > this.maxValue) {
      this.maxValue = value;
    }
    return this.maxValue;
  }
  reset() {
    this.maxValue = -Infinity;
  }
  get() {
    return this.maxValue;
  }
}
