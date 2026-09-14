import { defineComponent, h } from "vue";

export interface CenterProps {
  as?: string;
  inline?: boolean;
}

export const Center = defineComponent({
  name: "DuiCenter",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
    inline: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          "data-dui-component": "Center",
          "data-inline": props.inline ? "true" : undefined,
          class: ["dui-Center", attrs.class],
          style: [
            attrs.style,
            {
              alignItems: "center",
              display: props.inline ? "inline-flex" : "flex",
              justifyContent: "center",
            },
          ],
        },
        slots.default?.(),
      );
  },
});
