export type Quote = {
  id: number;
  value: number;
};

export type Statistic = {
  avg: number;
  min: number;
  max: number;
  start: number; // ms
  end: number; // ms
  moda: number;
  time_spent: number; //ms
  standart_deviation: number;
  lost_quotes: number;
};

export type TableRecord = {
  created_at: number;
  id: number;
};