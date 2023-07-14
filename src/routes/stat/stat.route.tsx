import { useParams, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../assets/arrow--left.svg";
import * as S from "./stat.route.style";
import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../../api/statisticsApi";
import { DbStatistic } from "../../types";
import { format } from "date-fns";

export const StatRoute = () => {
  const params = useParams();
  const navigate = useNavigate();
  const back = () => {
    navigate("/stats");
  };

  const { data: stat, isLoading } = useQuery<DbStatistic>({
    queryKey: ["stat", params.id],
    queryFn: () => {
      // @ts-ignore
      return statisticsApi.getStat(params.id);
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
          <div
            style={{
              marginTop: 38,
              display: "flex",
            }}
          >
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Початок розрахунків</S.Label>
              <S.Value>{format(new Date(+stat.start), "hh:mm:ss")}</S.Value>
            </div>
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Кінець розрахунків</S.Label>
              <S.Value>{format(new Date(+stat.end), "hh:mm:ss")}</S.Value>
            </div>
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Витраченний час</S.Label>
              <S.Value>
                {stat.time_spent < 1 ? "<1ms" : stat.time_spent}
              </S.Value>
            </div>
            <div>
              <S.Label>Кількість котируваннь</S.Label>
              <S.Value>{stat.quotes_amount}</S.Value>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 48,
            }}
          >
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Середне арефметичке</S.Label>
              <S.Value>{stat.avg}</S.Value>
            </div>
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Мінімальне значення</S.Label>
              <S.Value>{stat.min}</S.Value>
            </div>
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Максимальне значення</S.Label>
              <S.Value>{stat.max}</S.Value>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 27,
            }}
          >
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Стандартное отклонение</S.Label>
              <S.Value>{stat.standard_deviation}</S.Value>
            </div>
            <div
              style={{
                marginRight: 17,
              }}
            >
              <S.Label>Мода</S.Label>
              <S.Value>
                {stat.moda} ({stat.moda_count} раза)
              </S.Value>
            </div>
          </div>
        </>
      ) : (
        "no data"
      )}
    </>
  );
};
