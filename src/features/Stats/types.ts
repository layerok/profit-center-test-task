export type Quote = {
  id: number;
  value: number;
};

export type Stat = {
  avg: number;
  min_value: number;
  max_value: number;
  mode: number;
  mode_count: number;
  standard_deviation: number;
  lost_quotes: number;
  quotes_count: number;
};

export type DbStat = Stat & {
  id: number;
  start_time: number; // ms
  end_time: number; // ms
  time_spent: number; //ms
};

