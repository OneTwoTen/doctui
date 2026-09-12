import { defineComponent, h } from "vue";

export const VisuallyHidden = defineComponent({
  name: "DuiVisuallyHidden",
  inheritAttrs: false,
  props: { focusable: Boolean },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "span",
        {
          ...attrs,
          "data-dui-component": "VisuallyHidden",
          class: ["dui-VisuallyHidden", attrs.class],
          style: [
            attrs.style,
            props.focusable ? undefined : { clip: "rect(0 0 0 0)" },
          ],
        },
        slots.default?.(),
      );
  },
});
