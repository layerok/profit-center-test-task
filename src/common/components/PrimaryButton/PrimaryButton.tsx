import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLProps } from "react";
import * as S from "./PrimaryButton.style";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const PrimaryButton = (props: ButtonProps) => {
  return <S.Button {...props} />;
};
