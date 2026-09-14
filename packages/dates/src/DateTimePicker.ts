import { TextInput, type Radius, type Size } from "@doctui/core";
import { defineComponent, h, type PropType } from "vue";

export const DateTimePicker = defineComponent({
  name: "DuiDateTimePicker",
  props: {
    id: { type: String, default: undefined },
    modelValue: { type: String, default: "" },
    label: { type: String, default: undefined },
    description: { type: String, default: undefined },
    error: { type: String, default: undefined },
    ariaLabel: { type: String, default: undefined },
    disabled: Boolean,
    clearable: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  emits: ["update:modelValue", "blur", "clear"],
  setup(props, { emit }) {
    return () =>
      h(TextInput, {
        class: "dui-DateTimePicker",
        ...(props.id !== undefined ? { id: props.id } : {}),
        modelValue: props.modelValue,
        ...(props.label !== undefined ? { label: props.label } : {}),
        ...(props.description !== undefined
          ? { description: props.description }
          : {}),
        ...(props.error !== undefined ? { error: props.error } : {}),
        type: "datetime-local",
        size: props.size,
        radius: props.radius,
        disabled: props.disabled,
        clearable: props.clearable,
        "aria-label": props.label
          ? undefined
          : (props.ariaLabel ?? "Date and time"),
        "onUpdate:modelValue": (value: string) =>
          emit("update:modelValue", value),
        onBlur: (event: FocusEvent) => emit("blur", event),
        onClear: () => emit("clear"),
      });
  },
});
