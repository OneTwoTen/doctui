import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { fontSizeToken } from "./shared";

export interface KbdProps {
  size?: Size;
}

export const Kbd = defineComponent({
  name: "DuiKbd",
  inheritAttrs: false,
  props: { size: { type: String as PropType<Size>, default: "sm" } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "kbd",
        {
          ...attrs,
          "data-dui-component": "Kbd",
          class: ["dui-Kbd", attrs.class],
          style: [attrs.style, { fontSize: fontSizeToken(props.size) }],
        },
        slots.default?.(),
      );
  },
});
