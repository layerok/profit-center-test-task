import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ReactComponent as ArrowLeft } from "../../assets/arrow--left.svg";
import * as S from "./detail.route.style";
import { statsRoutePaths } from "../../route.paths";
import { useStatQuery } from "../../queries";

export const StatRoute = () => {
  const params = useParams();
  const navigate = useNavigate();

  const goBackToList = () => {
    navigate(statsRoutePaths.list);
  };

  const { data: stat, isLoading } = useStatQuery(Number(params.id));

  if (isLoading) {
    return <div>...loading</div>;
  }

  if (!stat) {
    return <div>No data</div>;
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
          <S.Value>{format(new Date(Number(stat.start)), "hh:mm:ss")}</S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Конец вычислений</S.Label>
          <S.Value>{format(new Date(Number(stat.end)), "hh:mm:ss")}</S.Value>
        </S.Prop>
        <S.Prop>
          <S.Label>Время потраченно</S.Label>
          <S.Value>{stat.time_spent < 1 ? "<1ms" : stat.time_spent}</S.Value>
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
  );
};

export const Component = StatRoute;
