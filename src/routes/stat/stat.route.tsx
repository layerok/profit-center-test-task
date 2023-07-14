import { useParams, useNavigate } from "react-router-dom";
import { BaseModal } from "../../components/BaseModal";
import { ReactComponent as ArrowLeft } from "../../assets/arrow--left.svg";
import * as S from "./stat.route.style";

export const StatRoute = () => {
  const params = useParams();
  const navigate = useNavigate();
  const back = () => {
    navigate("/stats");
  };
  const overlayStyles = {
    justifyItems: "center",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.4)",
    display: "grid",
    zIndex: 999999,
  };
  return (
    <BaseModal
      onOpenChange={(open) => {
        if (!open) {
          back();
        }
      }}
      open={true}
      overlayStyles={overlayStyles}
      render={({ close }) => {
        return (
          <div
            style={{
              background: "white",
              width: 476,
              height: 359,
              padding: 20,
              position: "relative",
            }}
          >
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
                <S.Value>12:00:00</S.Value>
              </div>
              <div
                style={{
                  marginRight: 17,
                }}
              >
                <S.Label>Кінець розрахунків</S.Label>
                <S.Value>12:00:00</S.Value>
              </div>
              <div
                style={{
                  marginRight: 17,
                }}
              >
                <S.Label>Витраченний час</S.Label>
                <S.Value>&lt;1ms</S.Value>
              </div>
              <div
    
              >
                <S.Label>Кількість котируваннь</S.Label>
                <S.Value>200000...</S.Value>
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
                <S.Value>5000</S.Value>
              </div>
              <div
                style={{
                  marginRight: 17,
                }}
              >
                <S.Label>Мінімальне значення</S.Label>
                <S.Value>5000</S.Value>
              </div>
              <div
                style={{
                  marginRight: 17,
                }}
              >
                <S.Label>Максимальне значення</S.Label>
                <S.Value>5000</S.Value>
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
                <S.Value>434.343...</S.Value>
              </div>
              <div
                style={{
                  marginRight: 17,
                }}
              >
                <S.Label>Мода</S.Label>
                <S.Value>5000 (2 раза)</S.Value>
              </div>
            </div>
          </div>
        );
      }}
    >
      <div></div>
    </BaseModal>
  );
};
