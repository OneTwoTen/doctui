import { defineComponent, h, type PropType } from "vue";
import type { Radius, Size } from "../theme/types";
import { radiusToken } from "./shared";

export interface PaperProps {
  shadow?: Size;
  radius?: Radius;
  withBorder?: boolean;
}

export const Paper = defineComponent({
  name: "DuiPaper",
  inheritAttrs: false,
  props: {
    shadow: String as PropType<Size>,
    radius: { type: String as PropType<Radius>, default: "md" },
    withBorder: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "div",
        {
          ...attrs,
          "data-dui-component": "Paper",
          "data-radius": props.radius,
          "data-shadow": props.shadow,
          "data-with-border": props.withBorder ? "true" : undefined,
          class: ["dui-Paper", attrs.class],
          style: [
            attrs.style,
            {
              background: "var(--dui-color-surface-raised)",
              border: props.withBorder
                ? "1px solid var(--dui-color-border)"
                : undefined,
              borderRadius: radiusToken(props.radius),
              boxShadow: props.shadow
                ? `var(--dui-shadow-${props.shadow})`
                : undefined,
            },
          ],
        },
        slots.default?.(),
      );
  },
});
