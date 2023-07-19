import { Outlet, useNavigate } from "react-router-dom";
import { appRoutePaths } from "../../../App/route.paths";
import * as S from "./layout.style";

export const LayoutRoute = () => {
  const navigate = useNavigate();
  return (
    <S.Overlay
      onClick={() => {
        navigate(appRoutePaths.home);
      }}
    >
      <S.Content>
        <S.Container>
          <Outlet />
        </S.Container>
      </S.Content>
    </S.Overlay>
  );
};

export const Component = LayoutRoute;

Object.assign(Component, {
  displayName: "LazyLayoutRoute",
});
