import { defineComponent, h, mergeProps, type PropType } from "vue";
import type { Size } from "../theme/types";
import {
  composeDescribedBy,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
import { InputWrapper } from "./InputWrapper";
import { fontSizeToken } from "./shared";

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
    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);

      return h(InputWrapper, getInputWrapperProps(props, false), {
        default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
          h(
            "label",
            mergeProps(rootAttrs, {
              class: "dui-Checkbox",
              for: id,
              "data-dui-component": "Checkbox",
              "data-checked": props.modelValue ? "true" : undefined,
              "data-disabled": props.disabled ? "true" : undefined,
              "data-error": props.error ? "true" : undefined,
              "data-required": props.required ? "true" : undefined,
              "data-size": props.size,
              style: { fontSize: fontSizeToken(props.size) },
            }),
            [
              h(
                "input",
                mergeProps(controlAttrs, {
                  id,
                  type: "checkbox",
                  checked: props.modelValue,
                  disabled: props.disabled,
                  required: props.required,
                  "aria-invalid": props.error
                    ? "true"
                    : controlAttrs["aria-invalid"],
                  "aria-describedby": composeDescribedBy(
                    describedBy,
                    controlAttrs["aria-describedby"],
                  ),
                  class: "dui-Checkbox-input",
                  style: {
                    fontSize: "inherit",
                    inlineSize: "1em",
                    blockSize: "1em",
                  },
                  onChange: (event: Event) =>
                    emit(
                      "update:modelValue",
                      (event.target as HTMLInputElement).checked,
                    ),
                }),
              ),
              slots.default?.() ??
                (props.label
                  ? [
                      props.label,
                      props.required
                        ? h("span", { "aria-hidden": "true" }, " *")
                        : null,
                    ]
                  : undefined),
            ],
          ),
      });
    };
  },
});
