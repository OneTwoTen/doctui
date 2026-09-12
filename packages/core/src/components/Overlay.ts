import type { PropType } from "vue";
import { defineComponent, h } from "vue";
import { Portal } from "../primitives";
import type { Color } from "../theme/types";

export const Overlay = defineComponent({
  name: "DuiOverlay",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: boolean) => true },
  props: {
    modelValue: Boolean,
    color: { type: String as PropType<Color>, default: "neutral" },
    opacity: { type: Number, default: 0.55 },
    closeOnClick: { type: Boolean, default: true },
  },
  setup(props, { attrs, emit, slots }) {
    return () => {
      if (!props.modelValue) return null;
      return h(Portal, null, {
        default: () =>
          h(
            "div",
            {
              ...attrs,
              "data-dui-component": "Overlay",
              "data-dui-overlay-backdrop": "",
              class: ["dui-Overlay", attrs.class],
              style: [attrs.style, { opacity: props.opacity }],
              onClick: (event: MouseEvent) => {
                if (
                  props.closeOnClick &&
                  event.target === event.currentTarget
                ) {
                  emit("update:modelValue", false);
                }
              },
            },
            h("div", { "data-dui-overlay-surface": "" }, slots.default?.()),
          ),
      });
    };
  },
});
