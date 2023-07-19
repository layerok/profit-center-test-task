import { useRef } from "react";
import { Timer } from "../timer";

export const useTimer = () => {
  const ref = useRef(new Timer());
  return ref.current;
};
