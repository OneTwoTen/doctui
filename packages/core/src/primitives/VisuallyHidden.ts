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
          "data-focusable": String(props.focusable),
          class: ["dui-VisuallyHidden", attrs.class],
        },
        slots.default?.(),
      );
  },
});
