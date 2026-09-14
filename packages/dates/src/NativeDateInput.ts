import { type Radius, type Size, TextInput } from "@doctui/core";
import { defineComponent, h, type PropType } from "vue";
import { type DateValue, parseDate } from "./date-utils";

export const NativeDateInput = defineComponent({
  name: "DuiNativeDateInput",
  props: {
    id: { type: String, default: undefined },
    modelValue: { type: String as PropType<DateValue>, default: null },
    label: { type: String, default: undefined },
    description: { type: String, default: undefined },
    error: { type: String, default: undefined },
    ariaLabel: { type: String, default: undefined },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabled: Boolean,
    clearable: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  emits: ["update:modelValue", "blur", "clear"],
  setup(props, { emit }) {
    return () =>
      h(TextInput, {
        class: "dui-NativeDateInput",
        ...(props.id !== undefined ? { id: props.id } : {}),
        modelValue: props.modelValue ?? "",
        ...(props.label !== undefined ? { label: props.label } : {}),
        ...(props.description !== undefined
          ? { description: props.description }
          : {}),
        ...(props.error !== undefined ? { error: props.error } : {}),
        type: "date",
        size: props.size,
        radius: props.radius,
        disabled: props.disabled,
        clearable: props.clearable,
        ...(props.minDate !== undefined ? { min: props.minDate } : {}),
        ...(props.maxDate !== undefined ? { max: props.maxDate } : {}),
        "aria-label": props.label ? undefined : (props.ariaLabel ?? "Date"),
        "onUpdate:modelValue": (value: string) => {
          emit("update:modelValue", value && parseDate(value) ? value : null);
        },
        onBlur: (event: FocusEvent) => emit("blur", event),
        onClear: () => emit("clear"),
      });
  },
});
