import { appConfig } from "../../../config/app.config";
import { IGetStatsReq, IGetStatsRes } from "./api.types";

export const getAllStats = async ({
  limit = 25,
  offset = 0,
}: IGetStatsReq = {}): Promise<IGetStatsRes> => {
  const res = await fetch(
    `${appConfig.apiBaseUrl}/stats.php?limit=${limit}&offset=${offset}`
  );
  return res.json();
};

export const addStat = async (record: {
  avg: number,
  min_value: number,
  max_value: number,
  start_time: number,
  mode: number,
  end_time: number;
  standard_deviation: number
  mode_count: number;
  time_spent: number;
  lost_quotes: number;
  quotes_count: number;
}) => {
  const formData = new FormData();
  formData.append("avg", String(record.avg));
  formData.append("min_value", String(record.min_value));
  formData.append("max_value", String(record.max_value));
  formData.append("start_time", String(record.start_time));
  formData.append("mode", String(record.mode));
  formData.append(
    "mode_count",
    String(record.mode_count)
  );
  formData.append("end_time", String(record.end_time));
  formData.append("time_spent", String(record.time_spent));
  formData.append("standard_deviation", String(record.standard_deviation));
  formData.append("lost_quotes", String(record.lost_quotes));
  formData.append("quotes_count", String(record.quotes_count));
  return fetch(`${appConfig.apiBaseUrl}/add_stat.php`, {
    method: "POST",
    body: formData,
  });
};

export const getStat = async (id: number) => {
  const res = await fetch(`${appConfig.apiBaseUrl}/get_stat.php?id=${id}`);
  return res.json();
};

export const statsApi = {
  getAll: getAllStats,
  add: addStat,
  get: getStat,
};
