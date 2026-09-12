import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { fontSizeToken, lineHeightToken } from "./shared";

export interface TextProps {
  as?: string;
  size?: Size;
  muted?: boolean;
  weight?: number | string;
}

export const Text = defineComponent({
  name: "DuiText",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "p" },
    size: { type: String as PropType<Size>, default: "md" },
    muted: { type: Boolean, default: false },
    weight: [Number, String] as PropType<number | string>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          "data-dui-component": "Text",
          "data-muted": props.muted ? "true" : undefined,
          class: ["dui-Text", attrs.class],
          style: [
            attrs.style,
            {
              color: props.muted
                ? "var(--dui-color-text-muted)"
                : "var(--dui-color-text)",
              fontFamily: "var(--dui-font-family)",
              fontSize: fontSizeToken(props.size),
              fontWeight: props.weight,
              lineHeight: lineHeightToken(props.size),
              margin: 0,
            },
          ],
        },
        slots.default?.(),
      );
  },
});
