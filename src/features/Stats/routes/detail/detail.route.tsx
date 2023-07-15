import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ReactComponent as ArrowLeft } from "../../assets/arrow--left.svg";
import * as S from "./detail.route.style";
import { statsRoutePaths } from "../../route.paths";
import { useStatQuery } from "../../queries";
import { formatMs } from "../../utils";

export const StatRoute = () => {
  const params = useParams();
  const navigate = useNavigate();

  const goBackToList = () => {
    navigate(statsRoutePaths.list);
  };

  const { data: stat, isLoading } = useStatQuery(Number(params.id));

  if (isLoading) {
    return <div>загрузка...</div>;
  }

  if (!stat) {
    return <div>Не удалось загрузить данные</div>;
  }

  return (
    <>
      <S.Header>
        <S.BackButtonContainer>
          <ArrowLeft onClick={goBackToList} />
        </S.BackButtonContainer>
        <S.Title>Статистика #{params.id}</S.Title>
      </S.Header>
      <S.Row
        style={{
          marginTop: 38,
        }}
      >
        <S.Prop>
          <S.Label>Начало вычислений</S.Label>
          <S.Value>
            {format(new Date(Number(stat.start_time)), "hh:mm:ss")}
          </S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Конец вычислений</S.Label>
          <S.Value>
            {format(new Date(Number(stat.end_time)), "hh:mm:ss")}
          </S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Время потраченно</S.Label>
          <S.Value title={String(stat.time_spent)}>
            {stat.time_spent < 1
              ? "<" + formatMs(1)
              : formatMs(stat.time_spent)}
          </S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Кол-во котировок</S.Label>
          <S.Value title={String(stat.quotes_count)}>
            {stat.quotes_count} шт.
          </S.Value>
        </S.Prop>
      </S.Row>

      <S.Row
        style={{
          marginTop: 48,
        }}
      >
        <S.Prop>
          <S.Label>Среднее ареф.</S.Label>
          <S.Value title={String(stat.avg)}>{stat.avg}</S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Минимальное значение</S.Label>
          <S.Value title={String(stat.min_value)}>{stat.min_value}</S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Максимальное значение</S.Label>
          <S.Value title={String(stat.max_value)}>{stat.max_value}</S.Value>
        </S.Prop>
      </S.Row>
      <S.Row
        style={{
          marginTop: 27,
        }}
      >
        <S.Prop>
          <S.Label>Стандартное отклонение</S.Label>
          <S.Value title={String(stat.standard_deviation)}>
            {stat.standard_deviation}
          </S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Мода</S.Label>
          <S.Value title={String(stat.mode)}>
            {stat.mode} ({stat.mode_count}x)
          </S.Value>
        </S.Prop>
      </S.Row>
    </>
  );
};

export const Component = StatRoute;
