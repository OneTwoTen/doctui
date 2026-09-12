import { defineComponent, h, mergeProps, type PropType } from "vue";
import type { Size } from "../theme/types";
import {
  composeDescribedBy,
  getFieldRootStateAttrs,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
import type { FieldClassNames, FieldStyles } from "./field-types";
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
  classNames?: FieldClassNames;
  styles?: FieldStyles;
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
    classNames: Object as PropType<FieldClassNames>,
    styles: Object as PropType<FieldStyles>,
  },
  setup(props, { attrs, emit, slots }) {
    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);

      return h(
        InputWrapper,
        mergeProps(
          getInputWrapperProps(props, false),
          { classNames: props.classNames, styles: props.styles },
          rootAttrs,
          getFieldRootStateAttrs(props, "Checkbox"),
        ),
        {
          default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
            h(
              "label",
              {
                class: ["dui-Checkbox", props.classNames?.body],
                style: props.styles?.body,
                for: id,
                "data-dui-component": "Checkbox",
                "data-checked": props.modelValue ? "true" : undefined,
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
                    class: ["dui-Checkbox-input", props.classNames?.input],
                    style: props.styles?.input,
                    onChange: (event: Event) =>
                      emit(
                        "update:modelValue",
                        (event.target as HTMLInputElement).checked,
                      ),
                  }),
                ),
                h("span", {
                  class: ["dui-Checkbox-control", props.classNames?.indicator],
                  style: props.styles?.indicator,
                  "aria-hidden": "true",
                }),
                h(
                  "span",
                  { class: ["dui-Checkbox-label", props.classNames?.labelText], style: props.styles?.labelText },
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
