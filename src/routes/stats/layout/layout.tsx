import { Outlet, useNavigate } from "react-router-dom";
import * as S from "./layout.style";
import {routePaths} from "../../../constants";

export const LayoutRoute = () => {
  const navigate = useNavigate();
  return (
    <S.Overlay
      onClick={() => {
        navigate(routePaths.home);
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
