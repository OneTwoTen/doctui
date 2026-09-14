import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { spacingToken } from "./shared";

export interface SpaceProps {
  size?: Size;
  orientation?: "horizontal" | "vertical";
}

export const Space = defineComponent({
  name: "DuiSpace",
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<Size>, default: "md" },
    orientation: {
      type: String as PropType<SpaceProps["orientation"]>,
      default: "vertical",
    },
  },
  setup(props, { attrs }) {
    return () =>
      h("div", {
        ...attrs,
        "aria-hidden": "true",
        "data-dui-component": "Space",
        "data-orientation": props.orientation,
        class: ["dui-Space", attrs.class],
        style: [
          attrs.style,
          props.orientation === "horizontal"
            ? { display: "inline-block", width: spacingToken(props.size) }
            : { height: spacingToken(props.size) },
        ],
      });
  },
});
