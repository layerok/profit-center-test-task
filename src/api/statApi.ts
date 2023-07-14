import { appConfig } from "../config/app.config";
import { Stat } from "../types";
import { IGetStatsReq, IGetStatsRes } from "./statApi.types";

export const statisticsApi = {
  getAll: async ({
    limit = 25,
    offset = 0,
  }: IGetStatsReq = {}): Promise<IGetStatsRes> => {
    const res = await fetch(
      `${appConfig.apiBaseUrl}/stats.php?limit=${limit}&offset=${offset}`
    );
    return res.json();
  },
  addStat: async (record: Stat) => {
    const formData = new FormData();
    formData.append("avg", String(record.avg));
    formData.append("min", String(record.min));
    formData.append("max", String(record.max));
    formData.append("start", String(record.start));
    formData.append("moda", String(record.moda));
    formData.append("moda_count", String(record.moda_count));
    formData.append("end", String(record.end));
    formData.append("time_spent", String(record.time_spent));
    formData.append("standard_deviation", String(record.standard_deviation));
    formData.append("lost_quotes", String(record.lost_quotes));
    formData.append("quotes_amount", String(record.quotes_amount));
    return fetch(`${appConfig.apiBaseUrl}/add_stat.php`, {
      method: "POST",
      body: formData,
    });
  },
  getStat: async (id: number) => {
    const res = await fetch(`${appConfig.apiBaseUrl}/get_stat.php?id=${id}`);
    return res.json();
  },
};
