import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import type { FlexAlign, FlexJustify } from "./Flex";
import { getFlexStyle } from "./flex-internals";

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
        props.as,
        {
          ...attrs,
          "data-dui-component": "Group",
          class: ["dui-Group", attrs.class],
          style: [
            attrs.style,
            getFlexStyle(
              props.gap,
              "row",
              props.align,
              props.justify,
              props.wrap ? "wrap" : "nowrap",
            ),
          ],
        },
        slots.default?.(),
      );
  },
});
