import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import type { FlexAlign, FlexJustify } from "./Flex";
import { getFlexStyle } from "./flex-internals";

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
        props.as,
        {
          ...attrs,
          "data-dui-component": "Stack",
          class: ["dui-Stack", attrs.class],
          style: [
            attrs.style,
            getFlexStyle(
              props.gap,
              "column",
              props.align,
              props.justify,
              "nowrap",
            ),
          ],
        },
        slots.default?.(),
      );
  },
});
