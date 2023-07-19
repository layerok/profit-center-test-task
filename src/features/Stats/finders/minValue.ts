export class MinValueFinder {
  minValue = +Infinity;
  find(value: number) {
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
