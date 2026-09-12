import { defineComponent, h, mergeProps, type PropType, ref } from "vue";
import type { Radius, Size } from "../theme/types";
import {
  composeDescribedBy,
  getFieldRootStateAttrs,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
import type { FieldClassNames, FieldStyles } from "./field-types";
import { InputWrapper } from "./InputWrapper";
import { radiusToken } from "./shared";

export interface TextareaProps {
  modelValue?: string;
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: Size;
  radius?: Radius;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  classNames?: FieldClassNames;
  styles?: FieldStyles;
}

export const Textarea = defineComponent({
  name: "DuiTextarea",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: string) => true },
  props: {
    modelValue: { type: String, default: "" },
    id: String,
    label: String,
    description: String,
    error: String,
    required: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
    rows: { type: Number, default: 3 },
    resize: {
      type: String as PropType<TextareaProps["resize"]>,
      default: "vertical",
    },
    classNames: Object as PropType<FieldClassNames>,
    styles: Object as PropType<FieldStyles>,
  },
  setup(props, { attrs, emit }) {
    const focused = ref(false);

    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);

      return h(
        InputWrapper,
        mergeProps(
          getInputWrapperProps(props),
          { classNames: props.classNames, styles: props.styles },
          rootAttrs,
          getFieldRootStateAttrs(props, "Textarea"),
        ),
        {
          default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
            h(
              "textarea",
              mergeProps(controlAttrs, {
                id,
                value: props.modelValue,
                disabled: props.disabled,
                readonly: props.readonly,
                required: props.required,
                placeholder: props.placeholder,
                rows: props.rows,
                "aria-invalid": props.error
                  ? "true"
                  : controlAttrs["aria-invalid"],
                "aria-describedby": composeDescribedBy(
                  describedBy,
                  controlAttrs["aria-describedby"],
                ),
                "data-dui-component": "Textarea",
                "data-focused": focused.value ? "true" : undefined,
                "data-disabled": props.disabled ? "true" : undefined,
                "data-readonly": props.readonly ? "true" : undefined,
                "data-error": props.error ? "true" : undefined,
                "data-required": props.required ? "true" : undefined,
                "data-size": props.size,
                class: ["dui-Textarea", props.classNames?.input],
                style: [
                  {
                    borderRadius: radiusToken(props.radius),
                    resize: props.resize,
                  },
                  props.styles?.input,
                ],
                onInput: (event: Event) =>
                  emit(
                    "update:modelValue",
                    (event.target as HTMLTextAreaElement).value,
                  ),
                onFocus: () => {
                  focused.value = true;
                },
                onBlur: () => {
                  focused.value = false;
                },
              }),
            ),
        },
      );
    };
  },
});
