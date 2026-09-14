import { defineComponent, h, type PropType } from "vue";
import type { Color, Size } from "../theme/types";
import { fontSizeToken } from "./shared";

export interface LoaderProps {
  type?: "oval" | "dots" | "bars";
  size?: Size;
  color?: Color;
}

function loaderColorToken(color: Color): string {
  return `var(--dui-color-${color}-filled)`;
}

export const Loader = defineComponent({
  name: "DuiLoader",
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<LoaderProps["type"]>, default: "oval" },
    size: { type: String as PropType<Size>, default: "md" },
    color: { type: String as PropType<Color>, default: "primary" },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        "span",
        {
          ...attrs,
          role: "status",
          "aria-label": "Loading",
          "data-color": props.color,
          "data-dui-component": "Loader",
          "data-size": props.size,
          "data-type": props.type,
          class: ["dui-Loader", `dui-Loader--${props.type}`, attrs.class],
          style: [
            attrs.style,
            {
              color: loaderColorToken(props.color),
              fontSize: fontSizeToken(props.size),
            },
          ],
        },
        props.type === "dots"
          ? [h("i"), h("i"), h("i")]
          : props.type === "bars"
            ? [h("i"), h("i"), h("i")]
            : undefined,
      );
  },
});
