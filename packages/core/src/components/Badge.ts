import { defineComponent, h, type PropType } from "vue";
import type { Color, Radius, Size, Variant } from "../theme/types";
import { fontSizeToken, radiusToken, spacingToken } from "./shared";

export interface BadgeProps {
  color?: Color;
  variant?: Variant;
  size?: Size;
  radius?: Radius;
}

function badgeTokens(color: Color, variant: Variant) {
  if (variant === "default") {
    return {
      background: "var(--dui-color-neutral-light)",
      color: "var(--dui-color-neutral-light-text)",
      border: "1px solid var(--dui-color-border)",
    };
  }
  if (variant === "outline") {
    return {
      background: "transparent",
      color: `var(--dui-color-${color}-outline-text)`,
      border: `1px solid var(--dui-color-${color}-outline)`,
    };
  }
  const tone = variant === "filled" ? "filled" : variant;
  return {
    background: `var(--dui-color-${color}-${tone})`,
    color: `var(--dui-color-${color}-${tone}-text)`,
    border: "1px solid transparent",
  };
}

export const Badge = defineComponent({
  name: "DuiBadge",
  inheritAttrs: false,
  props: {
    color: { type: String as PropType<Color>, default: "primary" },
    variant: { type: String as PropType<Variant>, default: "light" },
    size: { type: String as PropType<Size>, default: "sm" },
    radius: { type: String as PropType<Radius>, default: "full" },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "span",
        {
          ...attrs,
          "data-color": props.color,
          "data-dui-component": "Badge",
          "data-size": props.size,
          "data-variant": props.variant,
          class: ["dui-Badge", attrs.class],
          style: [
            attrs.style,
            badgeTokens(props.color, props.variant),
            {
              borderRadius: radiusToken(props.radius),
              fontSize: fontSizeToken(props.size),
              paddingInline: spacingToken(props.size === "xs" ? "xs" : "sm"),
            },
          ],
        },
        slots.default?.(),
      );
  },
});
