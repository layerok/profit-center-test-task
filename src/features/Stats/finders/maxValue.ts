export class MaxValueFinder {
  maxValue = -Infinity;
  find(value: number) {
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
