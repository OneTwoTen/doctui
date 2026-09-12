import { defineComponent, h, mergeProps, type PropType, ref } from "vue";
import type { Radius, Size } from "../theme/types";
import {
  composeDescribedBy,
  getFieldRootStateAttrs,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
import { InputWrapper } from "./InputWrapper";
import { radiusToken } from "./shared";

export interface NumberInputProps {
  modelValue?: number | null;
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
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = defineComponent({
  name: "DuiNumberInput",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: number | null) => true },
  props: {
    modelValue: { type: Number as PropType<number | null>, default: null },
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
    min: Number,
    max: Number,
    step: { type: Number, default: 1 },
  },
  setup(props, { attrs, emit }) {
    const focused = ref(false);

    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);

      return h(
        InputWrapper,
        mergeProps(
          getInputWrapperProps(props),
          rootAttrs,
          getFieldRootStateAttrs(props, "NumberInput"),
        ),
        {
          default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
            h(
              "input",
              mergeProps(controlAttrs, {
                id,
                type: "number",
                value: props.modelValue ?? "",
                min: props.min,
                max: props.max,
                step: props.step,
                disabled: props.disabled,
                readonly: props.readonly,
                required: props.required,
                placeholder: props.placeholder,
                "aria-invalid": props.error
                  ? "true"
                  : controlAttrs["aria-invalid"],
                "aria-describedby": composeDescribedBy(
                  describedBy,
                  controlAttrs["aria-describedby"],
                ),
                "data-dui-component": "NumberInput",
                "data-focused": focused.value ? "true" : undefined,
                "data-disabled": props.disabled ? "true" : undefined,
                "data-readonly": props.readonly ? "true" : undefined,
                "data-error": props.error ? "true" : undefined,
                "data-required": props.required ? "true" : undefined,
                "data-size": props.size,
                class: "dui-NumberInput",
                style: {
                  borderRadius: radiusToken(props.radius),
                },
                onInput: (event: Event) => {
                  const value = (event.target as HTMLInputElement).value;
                  emit("update:modelValue", value === "" ? null : Number(value));
                },
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
