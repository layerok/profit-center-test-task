export class AvgCalculator {
  sum = 0;
  quotesCount = 0;
  avg = 0;
  calculate(value: number) {
    this.quotesCount++;
    this.sum += value;
    this.avg = this.sum / this.quotesCount;
    return this.avg;
  }
  reset() {
    this.sum = 0;
    this.quotesCount = 0;
    this.avg = 0;
  }
  get() {
    return this.avg;
  }
}
