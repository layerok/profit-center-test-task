import { profile } from "../utils";
import { findMode } from "./findMode";

test("should calculate right mode", () => {
  const values = [233, 101, 444, 2000, 233];

  const result = findMode(values);

  expect(result.count).toBe(2);
  expect(result.value).toBe(233);
});

test("performance test", () => {
  const values: number[] = [];
  for (let i = 0; i < 50_000_000; i++) {
    const value = Math.ceil(Math.random() * 5000);
    values.push(value);
  }
  const info = profile(() => {
    return findMode(values);
  }, "calculateMode of 50 000 000 items");
  expect(info.timeSpent).toBeLessThan(1000);
});
