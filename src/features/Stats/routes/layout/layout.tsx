import { Outlet, useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import { appRoutePaths } from "../../../App/route.paths";
import * as S from './layout.style'

export const LayoutRoute = () => {
  const navigate = useNavigate();
  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => {
        navigate(appRoutePaths.home);
      }}
      style={{
        overlay: {
          justifyItems: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.4)",
          display: "grid",
          zIndex: 999999,
          position: "fixed",
        },
        content: {
          border: "none",
          borderRadius: 0,
          position: "relative",
          padding: 0,
          inset: 0,
          background: 'transparent',
          display: 'grid',
          justifyItems: 'center'
        },
      }}
    >
      <S.Container>
        <Outlet />
      </S.Container>
    </ReactModal>
  );
};

export const Component = LayoutRoute;

Object.assign(Component, {
  displayName: "LazyLayoutRoute",
});
