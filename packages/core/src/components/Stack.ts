import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { Flex, type FlexAlign, type FlexJustify } from "./Flex";

export interface StackProps {
  as?: string;
  gap?: Size;
  align?: FlexAlign;
  justify?: FlexJustify;
}

export const Stack = defineComponent({
  name: "DuiStack",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
    gap: { type: String as PropType<Size>, default: "md" },
    align: String as PropType<FlexAlign>,
    justify: String as PropType<FlexJustify>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        Flex,
        {
          ...attrs,
          as: props.as,
          gap: props.gap,
          direction: "column",
          align: props.align,
          justify: props.justify,
          "data-dui-component": "Stack",
          class: ["dui-Stack", attrs.class],
        },
        slots,
      );
  },
});
