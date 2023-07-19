export class MinValueCalculator {
  minValue = +Infinity;
  calculate(value: number) {
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
