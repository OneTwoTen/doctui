import type { CSSProperties } from "vue";
import type { Size } from "../theme/types";
import { spacingToken } from "./shared";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexAlign =
  | "stretch"
  | "flex-start"
  | "center"
  | "flex-end"
  | "baseline";
export type FlexJustify =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export function getFlexStyle(
  gap: Size | undefined,
  direction: FlexDirection,
  align: FlexAlign | undefined,
  justify: FlexJustify | undefined,
  wrap: FlexWrap,
): CSSProperties {
  return {
    display: "flex",
    gap: spacingToken(gap),
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
  };
}
