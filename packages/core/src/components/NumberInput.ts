import { defineComponent, h, type PropType, ref, useId } from "vue";
import type { Radius, Size } from "../theme/types";
import { InputWrapper } from "./InputWrapper";
import { fontSizeToken, radiusToken } from "./shared";

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
    const generatedId = useId();
    const id = props.id ?? `dui-number-input-${generatedId}`;
    const focused = ref(false);
    return () =>
      h(
        InputWrapper,
        {
          id,
          ...(props.label === undefined ? {} : { label: props.label }),
          ...(props.description === undefined
            ? {}
            : { description: props.description }),
          ...(props.error === undefined ? {} : { error: props.error }),
          required: props.required,
        },
        {
          default: ({ describedBy }: { describedBy?: string }) =>
            h("input", {
              ...attrs,
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
              "aria-invalid": props.error ? "true" : undefined,
              "aria-describedby": describedBy,
              "data-dui-component": "NumberInput",
              "data-focused": focused.value ? "true" : undefined,
              class: ["dui-NumberInput", attrs.class],
              style: [
                attrs.style,
                {
                  borderRadius: radiusToken(props.radius),
                  fontSize: fontSizeToken(props.size),
                },
              ],
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
        },
      );
  },
});
