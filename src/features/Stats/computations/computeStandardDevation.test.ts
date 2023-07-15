import { profile } from "../utils";
import { computeStandardDeviation } from "./computeStandardDevation";

test("should compute standardDeviation for less than 1 second for 50 million items", () => {
  const values: number[] = [];
  for (let i = 0; i < 50_000_000; i++) {
    const value = Math.ceil(Math.random() * 5000);
    values.push(value);
  }

  const info = profile(() => {
    return computeStandardDeviation(values);
  }, "computeStandardDevation");


  expect(info.timeSpent).toBeLessThanOrEqual(1000); // 1 second
});
