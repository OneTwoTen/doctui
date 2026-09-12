import { type Component, defineComponent, h, type PropType } from "vue";
import type { Radius, Size } from "../theme/types";
import { Combobox, type ComboboxOption } from "./Combobox";

export const Autocomplete = defineComponent({
  name: "DuiAutocomplete",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: string) => true },
  props: {
    modelValue: { type: String, default: "" },
    data: {
      type: Array as PropType<readonly ComboboxOption[]>,
      required: true,
    },
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
          multiple: false,
          "onUpdate:modelValue": (value: string | number | null) =>
            emit("update:modelValue", String(value ?? "")),
        },
        slots,
      );
  },
});
