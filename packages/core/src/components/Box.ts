import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { boxSpacingStyle } from "./shared";

export interface BoxProps {
  as?: string;
  padding?: Size;
  margin?: Size;
}

export const Box = defineComponent({
  name: "DuiBox",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
    padding: String as PropType<Size>,
    margin: String as PropType<Size>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          "data-dui-component": "Box",
          class: ["dui-Box", attrs.class],
          style: [attrs.style, boxSpacingStyle(props.padding, props.margin)],
        },
        slots.default?.(),
      );
  },
});
