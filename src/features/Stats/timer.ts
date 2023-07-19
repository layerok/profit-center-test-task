export class Timer {
  startTime: number | null = null;
  endTime: number | null = null;

  setStartTime(time: number) {
    this.startTime = time;
  }

  setEndTime(time: number) {
    this.endTime = time;
  }
}
