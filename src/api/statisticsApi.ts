import { Statistic } from "../types";
const apiBaseUrl = "http://localhost/profit_centre_statistics";

export const statisticsApi = {
  getAll: async () => {
    const res = await fetch(`${apiBaseUrl}/stats.php`);
    return res.json();
  },
  addStat: async (record: Statistic) => {
    const formData = new FormData();
    formData.append("avg", String(record.avg));
    formData.append("min", String(record.min));
    formData.append("max", String(record.max));
    formData.append("start", String(record.start));
    formData.append("end", String(record.end));
    formData.append("time_spent", String(record.time_spent));
    formData.append("standard_deviation", String(record.standart_deviation));
    formData.append("lost_quotes", String(record.lost_quotes));
    return fetch(`${apiBaseUrl}/add_stat.php`, {
      method: "POST",
      body: formData,
    });
  },
};
