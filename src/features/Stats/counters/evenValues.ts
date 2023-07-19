export class EvenValuesCounter {
  evenValues = 0;
  count(value: number) {
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
