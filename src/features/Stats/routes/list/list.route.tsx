import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import * as S from "./list.route.style";
import { statsRoutePaths } from "../../route.paths";
import { appRoutePaths } from "../../../App/route.paths";
import { useStatsQuery } from "../../queries";

export const StatsRoute = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate(appRoutePaths.home);
  };

  // todo: implement infinite list
  // todo: implement virtual list
  const limit = 102312312;

  const { data: stats, isLoading } = useStatsQuery({
    limit,
  });

  if (isLoading) {
    return <div>загрузка...</div>;
  }

  if (!stats) {
    return <div>Не удалось загрузить данные</div>;
  }

  return (
    <div>
      <S.CloseSvgContainer onClick={goHome}>
        <CloseSvg />
      </S.CloseSvgContainer>
      <S.Title>Статистика</S.Title>
      <S.DataContainer>
        {stats.records.map((record) => (
          <S.Row key={record.id}>
            <S.ID>#{record.id}</S.ID>
            <S.Date>
              {format(new Date(+record.start_time), "dd/MM/yyyy hh:mm:ss")}
            </S.Date>
            <S.Action>
              <Link
                to={statsRoutePaths.detail.replace(":id", String(record.id))}
              >
                View
              </Link>
            </S.Action>
          </S.Row>
        ))}
      </S.DataContainer>
    </div>
  );
};

export const Component = StatsRoute;
