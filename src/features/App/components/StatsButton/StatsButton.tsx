import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { useStatsStore } from "../../../Stats/stats.store";
import * as S from "./StatsButton.style";

export const StatsButton = observer(() => {
  const statsStore = useStatsStore();
  const navigate = useNavigate();

  const viewStats = () => {
    if (statsStore.quoteValues.length > 2) {
      statsStore.createStat(statsStore.quoteValues);
    }
    navigate(statsRoutePaths.list);
  };
  return <S.Button onClick={viewStats}>Статистика</S.Button>;
});
