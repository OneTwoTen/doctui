import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { spacingToken } from "./shared";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexAlign = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
export type FlexJustify =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface FlexProps {
  as?: string;
  gap?: Size;
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
}

export const Flex = defineComponent({
  name: "DuiFlex",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
    gap: String as PropType<Size>,
    direction: { type: String as PropType<FlexDirection>, default: "row" },
    align: String as PropType<FlexAlign>,
    justify: String as PropType<FlexJustify>,
    wrap: { type: String as PropType<FlexWrap>, default: "nowrap" },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          "data-dui-component": "Flex",
          class: ["dui-Flex", attrs.class],
          style: [
            attrs.style,
            {
              display: "flex",
              gap: spacingToken(props.gap),
              flexDirection: props.direction,
              alignItems: props.align,
              justifyContent: props.justify,
              flexWrap: props.wrap,
            },
          ],
        },
        slots.default?.(),
      );
  },
});
