import { defineComponent, h, type PropType, useId } from "vue";
import type { Size } from "../theme/types";
import { InputWrapper } from "./InputWrapper";

export interface CheckboxProps {
  modelValue?: boolean;
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: Size;
}

export const Checkbox = defineComponent({
  name: "DuiCheckbox",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: boolean) => true },
  props: {
    modelValue: Boolean,
    id: String,
    label: String,
    description: String,
    error: String,
    required: Boolean,
    disabled: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
  },
  setup(props, { attrs, emit, slots }) {
    const id = props.id ?? `dui-checkbox-${useId()}`;
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
                class: ["dui-Checkbox", attrs.class],
                "data-dui-component": "Checkbox",
                "data-size": props.size,
                "data-disabled": props.disabled ? "true" : undefined,
              },
              [
                h("input", {
                  ...attrs,
                  id,
                  type: "checkbox",
                  checked: props.modelValue,
                  disabled: props.disabled,
                  required: props.required,
                  "aria-invalid": props.error ? "true" : undefined,
                  "aria-describedby": describedBy,
                  class: "dui-Checkbox-input",
                  onChange: (event: Event) =>
                    emit(
                      "update:modelValue",
                      (event.target as HTMLInputElement).checked,
                    ),
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
