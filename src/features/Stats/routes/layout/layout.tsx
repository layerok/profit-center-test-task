import { Outlet, useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import { appRoutePaths } from "../../../App/route.paths";
import * as S from "./layout.style";
import styles from './layout.module.css';

export const LayoutRoute = () => {
  const navigate = useNavigate();
  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => {
        navigate(appRoutePaths.home);
      }}
      className={styles.content}
      overlayClassName={styles.overlay}
      style={styles}
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
