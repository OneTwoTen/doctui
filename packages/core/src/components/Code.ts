import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { fontSizeToken } from "./shared";

export interface CodeProps {
  block?: boolean;
  size?: Size;
}

export const Code = defineComponent({
  name: "DuiCode",
  inheritAttrs: false,
  props: {
    block: Boolean,
    size: { type: String as PropType<Size>, default: "sm" },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.block ? "pre" : "code",
        {
          ...attrs,
          "data-block": props.block ? "true" : undefined,
          "data-dui-component": "Code",
          class: ["dui-Code", attrs.class],
          style: [attrs.style, { fontSize: fontSizeToken(props.size) }],
        },
        props.block ? h("code", null, slots.default?.()) : slots.default?.(),
      );
  },
});
