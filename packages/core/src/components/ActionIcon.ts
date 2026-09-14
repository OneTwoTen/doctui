import type { ButtonHTMLAttributes } from "vue";
import { defineComponent, h, type PropType } from "vue";
import type { Color, Radius, Size, Variant } from "../theme/types";
import { fontSizeToken, radiusToken } from "./shared";

export interface ActionIconProps {
  ariaLabel: string;
  color?: Color;
  variant?: Variant;
  size?: Size;
  radius?: Radius;
  disabled?: boolean;
  type?: ButtonHTMLAttributes["type"];
}

function actionIconTokens(color: Color, variant: Variant) {
  if (variant === "default") {
    return {
      "--dui-action-icon-background": "var(--dui-color-neutral-light)",
      "--dui-action-icon-background-hover":
        "var(--dui-color-neutral-light-hover)",
      "--dui-action-icon-border": "var(--dui-color-border)",
      "--dui-action-icon-color": "var(--dui-color-neutral-light-text)",
    };
  }
  if (variant === "outline") {
    return {
      "--dui-action-icon-background": "transparent",
      "--dui-action-icon-background-hover": `var(--dui-color-${color}-outline-hover)`,
      "--dui-action-icon-border": `var(--dui-color-${color}-outline)`,
      "--dui-action-icon-color": `var(--dui-color-${color}-outline-text)`,
    };
  }
  const tone = variant === "filled" ? "filled" : variant;
  return {
    "--dui-action-icon-background":
      variant === "transparent"
        ? "transparent"
        : `var(--dui-color-${color}-${tone})`,
    "--dui-action-icon-background-hover": `var(--dui-color-${color}-${tone}-hover)`,
    "--dui-action-icon-border": "transparent",
    "--dui-action-icon-color": `var(--dui-color-${color}-${tone}-text)`,
  };
}

export const ActionIcon = defineComponent({
  name: "DuiActionIcon",
  inheritAttrs: false,
  emits: { click: (_event: MouseEvent) => true },
  props: {
    ariaLabel: { type: String, required: true },
    color: { type: String as PropType<Color>, default: "primary" },
    variant: { type: String as PropType<Variant>, default: "subtle" },
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
    disabled: Boolean,
    type: {
      type: String as PropType<ButtonHTMLAttributes["type"]>,
      default: "button",
    },
  },
  setup(props, { attrs, emit, slots }) {
    return () =>
      h(
        "button",
        {
          ...attrs,
          type: props.type,
          "aria-label": props.ariaLabel,
          disabled: props.disabled,
          "data-color": props.color,
          "data-disabled": props.disabled ? "true" : undefined,
          "data-dui-component": "ActionIcon",
          "data-size": props.size,
          "data-variant": props.variant,
          class: ["dui-ActionIcon", attrs.class],
          style: [
            attrs.style,
            actionIconTokens(props.color, props.variant),
            {
              borderRadius: radiusToken(props.radius),
              fontSize: fontSizeToken(props.size),
              width: `calc(var(--dui-font-size-${props.size}) + 1.5rem)`,
            },
          ],
          onClick: (event: MouseEvent) => {
            if (props.disabled) return;
            emit("click", event);
          },
        },
        slots.default?.(),
      );
  },
});
