export class ModeCounter {
  modeMap: Record<number, number> = {};
  maxCount = 0;
  mode = 0;

  count(value: number) {
    let count = this.modeMap[value] || 0;
    this.modeMap[value] = ++count;

    if (count > this.maxCount) {
      this.mode = value;
      this.maxCount = count;
    }
    return this.maxCount;
  }
  reset() {
    this.mode = 0;
    this.maxCount = 0;
    this.modeMap = {};
  }
  get() {
    return this.maxCount;
  }

}
