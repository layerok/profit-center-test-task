export type Quote = {
  id: number;
  value: number;
};

export type Stat = {
  avg: number;
  min: number;
  max: number;
  start: number; // ms
  end: number; // ms
  moda: number;
  moda_count: number;
  time_spent: number; //ms
  standard_deviation: number;
  lost_quotes: number;
  quotes_amount: number;
};

export type DbStat = Stat & {
  id: number;
};

