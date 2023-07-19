

export class StandardDeviationCalculator {
  sum = 0;
  avg = 0;
  quotesCount = 0;

  temp = 0;
  standardDeviation: null | number = null;
  
  recalculate(value: number) {
      this.quotesCount++;
      this.sum += value;

      this.avg = this.sum / this.quotesCount;

      const diff = value - this.avg;

      this.temp += diff * diff;

      if (this.quotesCount > 1) {
        this.standardDeviation = Math.sqrt(this.temp / (this.quotesCount - 1));
      }
      return this.standardDeviation;
  }
  reset() {
    this.sum = 0;
    this.avg = 0;
    this.quotesCount = 0;
    this.temp = 0;
  }
  get() {
    return this.standardDeviation;
  }
}
