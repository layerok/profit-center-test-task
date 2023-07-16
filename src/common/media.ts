import { generateMedia } from "styled-media-query";

export const breakpoints = {
  pc: "1280px",
  tablet: "768px",
  mobile: "375px",
};

export const media = generateMedia(breakpoints);

