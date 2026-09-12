import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import {
  type FlexAlign,
  type FlexDirection,
  type FlexJustify,
  type FlexWrap,
  getFlexStyle,
} from "./flex-internals";

export type {
  FlexAlign,
  FlexDirection,
  FlexJustify,
  FlexWrap,
} from "./flex-internals";

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
            getFlexStyle(
              props.gap,
              props.direction,
              props.align,
              props.justify,
              props.wrap,
            ),
          ],
        },
        slots.default?.(),
      );
  },
});
