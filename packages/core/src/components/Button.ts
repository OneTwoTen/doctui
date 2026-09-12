import {
  defineComponent,
  h,
  type ButtonHTMLAttributes,
  type PropType,
} from "vue";
import type { Color, Radius, Size, Variant } from "../theme/types";
import { fontSizeToken, radiusToken, spacingToken } from "./shared";

export interface ButtonProps {
  color?: Color;
  variant?: Variant;
  size?: Size;
  radius?: Radius;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: ButtonHTMLAttributes["type"];
}

function buttonTokens(color: Color, variant: Variant): Record<string, string> {
  if (variant === "transparent") {
    return {
      "--dui-button-background": "transparent",
      "--dui-button-background-hover": "transparent",
      "--dui-button-border": "transparent",
      "--dui-button-color": `var(--dui-color-${color}-filled)`,
    };
  }

  if (variant === "default") {
    return {
      "--dui-button-background": "var(--dui-color-neutral-light)",
      "--dui-button-background-hover": "var(--dui-color-neutral-light-hover)",
      "--dui-button-border": "var(--dui-color-border)",
      "--dui-button-color": "var(--dui-color-neutral-light-text)",
    };
  }

  const background =
    variant === "outline" ? "transparent" : `var(--dui-color-${color}-${variant})`;
  const border =
    variant === "outline" ? `var(--dui-color-${color}-outline)` : "transparent";

  return {
    "--dui-button-background": background,
    "--dui-button-background-hover": `var(--dui-color-${color}-${variant}-hover)`,
    "--dui-button-border": border,
    "--dui-button-color": `var(--dui-color-${color}-${variant}-text)`,
  };
}

export const Button = defineComponent({
  name: "DuiButton",
  inheritAttrs: false,
  emits: {
    click: (_event: MouseEvent) => true,
  },
  props: {
    color: { type: String as PropType<Color>, default: "primary" },
    variant: { type: String as PropType<Variant>, default: "filled" },
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: false },
    type: {
      type: String as PropType<ButtonHTMLAttributes["type"]>,
      default: "button",
    },
  },
  setup(props, { attrs, emit, slots }) {
    return () => {
      const isDisabled = props.disabled || props.loading;
      const paddingX = props.size === "xs" ? "sm" : props.size === "xl" ? "xl" : "md";

      return h(
        "button",
        {
          ...attrs,
          type: props.type,
          disabled: isDisabled,
          "aria-busy": props.loading ? "true" : undefined,
          "data-dui-component": "Button",
          "data-color": props.color,
          "data-variant": props.variant,
          "data-size": props.size,
          "data-radius": props.radius,
          "data-loading": props.loading ? "true" : undefined,
          class: ["dui-Button", attrs.class],
          style: [
            attrs.style,
            buttonTokens(props.color, props.variant),
            {
              borderRadius: radiusToken(props.radius),
              fontSize: fontSizeToken(props.size),
              gap: spacingToken("xs"),
              padding: `${spacingToken("xs")} ${spacingToken(paddingX)}`,
              width: props.fullWidth ? "100%" : undefined,
            },
          ],
          onClick: (event: MouseEvent) => {
            if (isDisabled) {
              event.preventDefault();
              event.stopImmediatePropagation();
              return;
            }

            emit("click", event);
          },
        },
        [
          props.loading
            ? h("span", {
                "aria-hidden": "true",
                "data-dui-button-loader": "",
                class: "dui-Button-loader",
              })
            : null,
          h("span", { class: "dui-Button-label" }, slots.default?.()),
        ],
      );
    };
  },
});
