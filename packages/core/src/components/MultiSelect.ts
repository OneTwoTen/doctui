import { type Component, defineComponent, h, type PropType } from "vue";
import type { Radius, Size } from "../theme/types";
import { Combobox, type ComboboxOption } from "./Combobox";

export const MultiSelect = defineComponent({
  name: "DuiMultiSelect",
  inheritAttrs: false,
  emits: {
    "update:modelValue": (_value: readonly (string | number)[]) => true,
    clear: () => true,
  },
  props: {
    modelValue: {
      type: Array as PropType<readonly (string | number)[]>,
      default: () => [],
    },
    data: {
      type: Array as PropType<readonly ComboboxOption[]>,
      required: true,
    },
    id: String,
    label: String,
    description: String,
    error: String,
    required: Boolean,
    disabled: Boolean,
    placeholder: String,
    clearable: Boolean,
    ariaLabel: String,
    nothingFound: String,
    size: String as PropType<Size>,
    radius: String as PropType<Radius>,
  },
  setup(props, { attrs, emit, slots }) {
    return () =>
      h(
        Combobox as unknown as Component,
        {
          ...attrs,
          ...props,
          searchable: true,
          multiple: true,
          "onUpdate:modelValue": (value: readonly (string | number)[]) =>
            emit("update:modelValue", value),
          onClear: () => emit("clear"),
        },
        slots,
      );
  },
});
