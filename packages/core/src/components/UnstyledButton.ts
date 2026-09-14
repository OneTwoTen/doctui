import type { ButtonHTMLAttributes } from "vue";
import { defineComponent, h, type PropType } from "vue";

export interface UnstyledButtonProps {
  disabled?: boolean;
  type?: ButtonHTMLAttributes["type"];
}

export const UnstyledButton = defineComponent({
  name: "DuiUnstyledButton",
  inheritAttrs: false,
  emits: { click: (_event: MouseEvent) => true },
  props: {
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
          disabled: props.disabled,
          "data-disabled": props.disabled ? "true" : undefined,
          "data-dui-component": "UnstyledButton",
          class: ["dui-UnstyledButton", attrs.class],
          onClick: (event: MouseEvent) => {
            if (!props.disabled) emit("click", event);
          },
        },
        slots.default?.(),
      );
  },
});
