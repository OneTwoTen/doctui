import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { Flex, type FlexAlign, type FlexJustify } from "./Flex";

export interface GroupProps {
  as?: string;
  gap?: Size;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
}

export const Group = defineComponent({
  name: "DuiGroup",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
    gap: { type: String as PropType<Size>, default: "sm" },
    align: { type: String as PropType<FlexAlign>, default: "center" },
    justify: String as PropType<FlexJustify>,
    wrap: { type: Boolean, default: true },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        Flex,
        {
          ...attrs,
          as: props.as,
          gap: props.gap,
          direction: "row",
          align: props.align,
          justify: props.justify,
          wrap: props.wrap ? "wrap" : "nowrap",
          "data-dui-component": "Group",
          class: ["dui-Group", attrs.class],
        },
        slots,
      );
  },
});
