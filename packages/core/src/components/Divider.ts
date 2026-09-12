import { defineComponent, h, type PropType } from "vue";
import type { Color, Size } from "../theme/types";
import { spacingToken } from "./shared";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  size?: Size;
  color?: Color;
  label?: string;
}

export const Divider = defineComponent({
  name: "DuiDivider",
  inheritAttrs: false,
  props: {
    orientation: {
      type: String as PropType<DividerProps["orientation"]>,
      default: "horizontal",
    },
    size: { type: String as PropType<Size>, default: "xs" },
    color: { type: String as PropType<Color>, default: "neutral" },
    label: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "div",
        {
          ...attrs,
          role: "separator",
          "aria-orientation": props.orientation,
          "data-color": props.color,
          "data-dui-component": "Divider",
          "data-orientation": props.orientation,
          class: ["dui-Divider", attrs.class],
          style: [
            attrs.style,
            props.orientation === "vertical"
              ? {
                  borderInlineStart: `${spacingToken(props.size)} solid var(--dui-color-border)`,
                }
              : {
                  borderTop: `${spacingToken(props.size)} solid var(--dui-color-border)`,
                },
          ],
        },
        props.label || slots.default?.()
          ? h(
              "span",
              { class: "dui-Divider-label" },
              props.label ?? slots.default?.(),
            )
          : undefined,
      );
  },
});
