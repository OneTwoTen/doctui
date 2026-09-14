import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";

export interface ContainerProps {
  as?: string;
  size?: Size;
}

export const Container = defineComponent({
  name: "DuiContainer",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
    size: { type: String as PropType<Size>, default: "lg" },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          "data-dui-component": "Container",
          "data-size": props.size,
          class: ["dui-Container", attrs.class],
          style: [
            attrs.style,
            {
              marginInline: "auto",
              maxWidth: `var(--dui-breakpoint-${props.size})`,
              paddingInline: "var(--dui-spacing-md)",
              width: "100%",
            },
          ],
        },
        slots.default?.(),
      );
  },
});
