import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { spacingToken } from "./shared";

export interface GridProps {
  as?: string;
  columns?: number | string;
  gap?: Size;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "stretch";
}

export const Grid = defineComponent({
  name: "DuiGrid",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
    columns: {
      type: [Number, String] as PropType<number | string>,
      default: 12,
    },
    gap: { type: String as PropType<Size>, default: "md" },
    align: String as PropType<GridProps["align"]>,
    justify: String as PropType<GridProps["justify"]>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          "data-columns": String(props.columns),
          "data-dui-component": "Grid",
          class: ["dui-Grid", attrs.class],
          style: [
            attrs.style,
            {
              alignItems: props.align,
              display: "grid",
              gap: spacingToken(props.gap),
              gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
              justifyItems: props.justify,
            },
          ],
        },
        slots.default?.(),
      );
  },
});
