import { useParams, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../assets/arrow--left.svg";
import * as S from "./stat.route.style";
import { useQuery } from "@tanstack/react-query";
import { DbStat } from "../../types";
import { format } from "date-fns";
import { routePaths } from "../../constants/route.constant";
import { getStat } from "../../api/stats.api";

export const StatRoute = () => {
  const params = useParams();
  const navigate = useNavigate();
  const back = () => {
    navigate(routePaths.stats);
  };

  const { data: stat, isLoading } = useQuery<DbStat>({
    queryKey: ["stat", params.id],
    queryFn: () => {
      return getStat(+(params.id as string));
    },
  });
  return (
    <>
      {isLoading ? (
        "...loading"
      ) : stat ? (
        <>
          <S.Header>
            <ArrowLeft
              style={{
                cursor: "pointer",
              }}
              onClick={back}
            />
            <S.Title>Статистика #{params.id}</S.Title>
          </S.Header>
          <S.Row
            style={{
              marginTop: 38,
            }}
          >
            <S.Prop>
              <S.Label>Начало вычислений</S.Label>
              <S.Value>{format(new Date(+stat.start), "hh:mm:ss")}</S.Value>
            </S.Prop>
            <S.Prop>
              <S.Label>Конец вычислений</S.Label>
              <S.Value>{format(new Date(+stat.end), "hh:mm:ss")}</S.Value>
            </S.Prop>
            <S.Prop>
              <S.Label>Время потраченно</S.Label>
              <S.Value>
                {stat.time_spent < 1 ? "<1ms" : stat.time_spent}
              </S.Value>
            </S.Prop>
            <S.Prop>
              <S.Label>Кол-во котировок</S.Label>
              <S.Value>{stat.quotes_amount}</S.Value>
            </S.Prop>
          </S.Row>

          <S.Row
            style={{
              marginTop: 48,
            }}
          >
            <S.Prop>
              <S.Label>Середне арефметичке</S.Label>
              <S.Value>{stat.avg}</S.Value>
            </S.Prop>
            <S.Prop>
              <S.Label>Мінімальне значення</S.Label>
              <S.Value>{stat.min}</S.Value>
            </S.Prop>
            <S.Prop>
              <S.Label>Максимальне значення</S.Label>
              <S.Value>{stat.max}</S.Value>
            </S.Prop>
          </S.Row>
          <S.Row
            style={{
              marginTop: 27,
            }}
          >
            <S.Prop>
              <S.Label>Стандартное отклонение</S.Label>
              <S.Value>{stat.standard_deviation}</S.Value>
            </S.Prop>
            <S.Prop>
              <S.Label>Мода</S.Label>
              <S.Value>
                {stat.moda} ({stat.moda_count}x)
              </S.Value>
            </S.Prop>
          </S.Row>
        </>
      ) : (
        "no data"
      )}
    </>
  );
};
