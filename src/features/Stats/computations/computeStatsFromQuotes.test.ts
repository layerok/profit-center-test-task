import { computeStatsFromQuotes } from "./computeStatsFromQuotes";
import { Quote } from "../types";

test("should compute right statistics", () => {
  const quotes: Quote[] = [
    {
      id: 0,
      value: 233,
    },
    {
      id: 9,
      value: 444,
    },
  ];
  const record = computeStatsFromQuotes(quotes);
  expect(record.max).toBe(444);
  expect(record.moda).toBe(233);
  expect(record.min).toBe(233);
  expect(record.avg).toBe(338.5);
  expect(record.lost_quotes).toBe(8);
  expect(record.standard_deviation).toBe(149.19953083036154);
  expect(record.time_spent).toBeLessThan(1000); // 1 second
  expect(record.time_spent).toBeGreaterThanOrEqual(0);
  expect(record.end).toBeGreaterThanOrEqual(record.start);
  expect(record.moda_count).toBe(1);
  expect(record.quotes_amount).toBe(2);
});

test("should compute right statistics 2", () => {
  const quotes: Quote[] = [
    {
      id: 1,
      value: 233,
    },
    {
      id: 2,
      value: 101,
    },
    {
      id: 4,
      value: 444,
    },
    {
      id: 5,
      value: 2000,
    },
    {
      id: 21,
      value: 233,
    },
  ];
  const record = computeStatsFromQuotes(quotes);
  expect(record.max).toBe(2000);
  expect(record.moda).toBe(233);
  expect(record.min).toBe(101);
  expect(record.avg).toBe(602.2);
  expect(record.lost_quotes).toBe(16);
  expect(record.standard_deviation).toBe(790.9947534592123);
  expect(record.time_spent).toBeLessThan(1000); // 1 second
  expect(record.time_spent).toBeGreaterThanOrEqual(0);
  expect(record.end).toBeGreaterThanOrEqual(record.start);
  expect(record.moda_count).toBe(2);
  expect(record.quotes_amount).toBe(5);
});

test("should compute right statistics 3", () => {
  const quotes: Quote[] = [
    {
      id: 1,
      value: 1,
    },
    {
      id: 2,
      value: -5032,
    },
    {
      id: 4,
      value: 1,
    },
    {
      id: 5,
      value: 5003,
    },
    {
      id: 6,
      value: 2233,
    },
    {
      id: 7,
      value: 2233,
    },
  ];
  const record = computeStatsFromQuotes(quotes);
  expect(record.max).toBe(5003);
  expect(record.moda).toBe(1);
  expect(record.min).toBe(-5032);
  expect(record.avg).toBe(739.8333333333334);
  expect(record.lost_quotes).toBe(1);
  expect(record.standard_deviation).toBe(3377.5580774676055);
  expect(record.time_spent).toBeLessThan(1000); // 1 second
  expect(record.time_spent).toBeGreaterThanOrEqual(0);
  expect(record.end).toBeGreaterThanOrEqual(record.start);
  expect(record.moda_count).toBe(2);
  expect(record.quotes_amount).toBe(6);
});
