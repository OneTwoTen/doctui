import type { PropType } from "vue";
import { computed, defineComponent, h } from "vue";
import { Portal } from "../primitives";
import { useDoctuiColorScheme, useDoctuiTheme } from "../theme/context";
import { getThemeCssVariables } from "../theme/css-variables";
import type { Color } from "../theme/types";

export interface OverlayVisualProps {
  color?: Color;
  opacity?: number;
}

export const Overlay = defineComponent({
  name: "DuiOverlay",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: boolean) => true },
  props: {
    modelValue: Boolean,
    color: { type: String as PropType<Color>, default: "neutral" },
    opacity: {
      type: Number,
      default: 0.55,
      validator: (value: number) =>
        Number.isFinite(value) && value >= 0 && value <= 1,
    },
    closeOnClick: { type: Boolean, default: true },
    withBackdrop: { type: Boolean, default: true },
    portalTarget: {
      type: [String, Object] as PropType<string | HTMLElement>,
      default: "body",
    },
  },
  setup(props, { attrs, emit, slots }) {
    const theme = useDoctuiTheme();
    const colorScheme = useDoctuiColorScheme();
    const themeVariables = computed(() =>
      getThemeCssVariables(theme.value, colorScheme.value),
    );

    return () => {
      if (!props.modelValue) return null;
      return h(
        Portal,
        { to: props.portalTarget },
        {
          default: () =>
            h(
              "div",
              {
                ...attrs,
                "data-dui-component": "Overlay",
                "data-dui-overlay-backdrop": "",
                "data-dui-color-scheme": colorScheme.value,
                "data-with-backdrop": props.withBackdrop ? "true" : "false",
                class: ["dui-Overlay", attrs.class],
                style: [
                  themeVariables.value,
                  attrs.style,
                  {
                    "--dui-overlay-color": `var(--dui-color-${props.color}-filled)`,
                    "--dui-overlay-opacity": String(props.opacity),
                    background: props.withBackdrop ? undefined : "transparent",
                  },
                ],
                onClick: (event: MouseEvent) => {
                  if (
                    props.closeOnClick &&
                    event.target === event.currentTarget
                  ) {
                    emit("update:modelValue", false);
                  }
                },
              },
              h(
                "div",
                {
                  "data-dui-overlay-surface": "",
                  style: { width: "100%" },
                },
                slots.default?.(),
              ),
            ),
        },
      );
    };
  },
});
