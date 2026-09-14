import { defineComponent, h, type PropType } from "vue";
import type { Radius, Size } from "../theme/types";
import type { FieldClassNames, FieldStyles } from "./field-types";
import { TextInput } from "./TextInput";

export interface PasswordInputProps {
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
  clearable?: boolean;
  classNames?: FieldClassNames;
  styles?: FieldStyles;
}

export const PasswordInput = defineComponent({
  name: "DuiPasswordInput",
  inheritAttrs: false,
  emits: {
    "update:modelValue": (_value: string) => true,
    clear: () => true,
  },
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
    clearable: Boolean,
    classNames: Object as PropType<FieldClassNames>,
    styles: Object as PropType<FieldStyles>,
  },
  setup(props, { attrs, emit, slots }) {
    return () => {
      const textInputProps: Record<string, unknown> = {
        ...attrs,
        modelValue: props.modelValue,
        type: "password",
        ...(props.id === undefined ? {} : { id: props.id }),
        ...(props.label === undefined ? {} : { label: props.label }),
        ...(props.description === undefined
          ? {}
          : { description: props.description }),
        ...(props.error === undefined ? {} : { error: props.error }),
        required: props.required,
        size: props.size,
        radius: props.radius,
        disabled: props.disabled,
        readonly: props.readonly,
        ...(props.placeholder === undefined
          ? {}
          : { placeholder: props.placeholder }),
        clearable: props.clearable,
        classNames: props.classNames,
        styles: props.styles,
        "onUpdate:modelValue": (value: string) =>
          emit("update:modelValue", value),
        onClear: () => emit("clear"),
      };
      return h(TextInput, textInputProps, slots);
    };
  },
});
