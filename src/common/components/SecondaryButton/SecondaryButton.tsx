import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLProps } from "react";
import * as S from "./SecondaryButton.style";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const SecondaryButton = (props: ButtonProps) => {
  return <S.Button {...props} />;
};
