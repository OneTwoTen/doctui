import { defineComponent, h, mergeProps, type PropType } from "vue";
import type { Size } from "../theme/types";
import {
  composeDescribedBy,
  getFieldRootStateAttrs,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
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
    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);
      const checked = props.modelValue === props.value;

      return h(
        InputWrapper,
        mergeProps(
          getInputWrapperProps(props, false),
          rootAttrs,
          getFieldRootStateAttrs(props, "Radio"),
        ),
        {
          default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
            h(
              "label",
              {
                class: "dui-Radio",
                for: id,
                "data-dui-component": "Radio",
                "data-checked": checked ? "true" : undefined,
                "data-disabled": props.disabled ? "true" : undefined,
                "data-error": props.error ? "true" : undefined,
                "data-required": props.required ? "true" : undefined,
                "data-size": props.size,
              },
              [
                h(
                  "input",
                  mergeProps(controlAttrs, {
                    id,
                    type: "radio",
                    name: props.name,
                    value: props.value,
                    checked,
                    disabled: props.disabled,
                    required: props.required,
                    "aria-invalid": props.error
                      ? "true"
                      : controlAttrs["aria-invalid"],
                    "aria-describedby": composeDescribedBy(
                      describedBy,
                      controlAttrs["aria-describedby"],
                    ),
                    class: "dui-Radio-input",
                    onChange: () => emit("update:modelValue", props.value),
                  }),
                ),
                h("span", {
                  class: "dui-Radio-control",
                  "aria-hidden": "true",
                }),
                h(
                  "span",
                  { class: "dui-Radio-label" },
                  slots.default?.() ??
                    (props.label
                      ? [
                          props.label,
                          props.required
                            ? h("span", { "aria-hidden": "true" }, " *")
                            : null,
                        ]
                      : undefined),
                ),
              ],
            ),
        },
      );
    };
  },
});
