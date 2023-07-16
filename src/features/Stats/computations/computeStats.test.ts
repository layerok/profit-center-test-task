import { computeStats } from "./computeStats";
import { profile } from "../utils";

test("should compute right stats", () => {
  const values = [233, 444];
  const startTime = Date.now();
  const record = computeStats(values);

  const endTime = Date.now();

  const timeSpent = endTime - startTime;

  expect(record.maxValue).toBe(444);
  expect(record.mode).toBe(233);
  expect(record.modeCount).toBe(1);
  expect(record.minValue).toBe(233);
  expect(record.avg).toBe(338.5);
  expect(record.standardDeviation).toBe(149.19953083036154);
  expect(values.length).toBe(2);

  expect(timeSpent).toBeLessThan(1000); // 1 second
  expect(timeSpent).toBeGreaterThanOrEqual(0);
});

test("should compute right stats 2", () => {
  const values = [233, 101, 444, 2000, 233];
  const startTime = Date.now();
  const record = computeStats(values);
  const endTime = Date.now();

  const timeSpent = endTime - startTime;

  expect(record.maxValue).toBe(2000);
  expect(record.mode).toBe(233);
  expect(record.modeCount).toBe(2);
  expect(record.minValue).toBe(101);
  expect(record.avg).toBe(602.2);
  expect(record.standardDeviation).toBe(790.9947534592123);
  expect(timeSpent).toBeLessThan(1000); // 1 second
  expect(timeSpent).toBeGreaterThanOrEqual(0);
  expect(values.length).toBe(5);
});

test("should compute right stats 3", () => {
  const values = [1, -5032, 1, 5003, 2233, 2233];
  const startTime = Date.now();
  const record = computeStats(values);
  const endTime = Date.now();

  const timeSpent = endTime - startTime;
  expect(record.maxValue).toBe(5003);
  expect(record.mode).toBe(1);
  expect(record.modeCount).toBe(2);
  expect(record.minValue).toBe(-5032);
  expect(record.avg).toBe(739.8333333333334);
  expect(record.standardDeviation).toBe(3377.5580774676055);
  expect(timeSpent).toBeLessThan(1000); // 1 second
  expect(timeSpent).toBeGreaterThanOrEqual(0);
  expect(values.length).toBe(6);
});

test("should compute stats for less than 1 second for 50 millions values", () => {
  const values: number[] = [];
  for (let i = 0; i < 50_000_000; i++) {
    const value = Math.ceil(Math.random() * 5000);
    values.push(value);
  }

  const info = profile(() => {
    return computeStats(values);
  }, "computeStatsFromQuotes");

  expect(info.timeSpent).toBeLessThanOrEqual(1000); // 1 second
});
