import { defineComponent, h, type PropType, useId } from "vue";
import type { Size } from "../theme/types";
import { InputWrapper } from "./InputWrapper";

export interface RadioProps {
  modelValue?: string | number;
  value: string | number;
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: Size;
}

export const Radio = defineComponent({
  name: "DuiRadio",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: string | number) => true },
  props: {
    modelValue: [String, Number] as PropType<string | number>,
    value: {
      type: [String, Number] as PropType<string | number>,
      required: true,
    },
    id: String,
    name: String,
    label: String,
    description: String,
    error: String,
    required: Boolean,
    disabled: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
  },
  setup(props, { attrs, emit, slots }) {
    const id = props.id ?? `dui-radio-${useId()}`;
    return () =>
      h(
        InputWrapper,
        {
          id,

          ...(props.description === undefined
            ? {}
            : { description: props.description }),
          ...(props.error === undefined ? {} : { error: props.error }),
          required: props.required,
        },
        {
          default: ({ describedBy }: { describedBy?: string }) =>
            h(
              "label",
              {
                class: ["dui-Radio", attrs.class],
                "data-dui-component": "Radio",
                "data-size": props.size,
                "data-disabled": props.disabled ? "true" : undefined,
              },
              [
                h("input", {
                  ...attrs,
                  id,
                  type: "radio",
                  name: props.name,
                  value: props.value,
                  checked: props.modelValue === props.value,
                  disabled: props.disabled,
                  required: props.required,
                  "aria-invalid": props.error ? "true" : undefined,
                  "aria-describedby": describedBy,
                  class: "dui-Radio-input",
                  onChange: () => emit("update:modelValue", props.value),
                }),
                slots.default?.() ??
                  (props.label
                    ? [props.label, props.required ? " *" : null]
                    : undefined),
              ],
            ),
        },
      );
  },
});
