import { computed, defineComponent, h, type PropType, ref, useId } from "vue";
import type { Radius, Size } from "../theme/types";
import { InputWrapper } from "./InputWrapper";
import { fontSizeToken, radiusToken } from "./shared";

export interface ComboboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type ComboboxValue =
  | string
  | number
  | null
  | readonly (string | number)[];

export interface ComboboxProps {
  modelValue?: ComboboxValue;
  data: readonly ComboboxOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  nothingFound?: string;
  size?: Size;
  radius?: Radius;
}

export const Combobox = defineComponent({
  name: "DuiCombobox",
  inheritAttrs: false,
  emits: {
    "update:modelValue": (_value: ComboboxValue) => true,
    clear: () => true,
  },
  props: {
    modelValue: [String, Number, Array] as PropType<ComboboxValue>,
    data: {
      type: Array as PropType<readonly ComboboxOption[]>,
      required: true,
    },
    multiple: Boolean,
    searchable: Boolean,
    clearable: Boolean,
    label: String,
    description: String,
    error: String,
    required: Boolean,
    disabled: Boolean,
    placeholder: String,
    ariaLabel: String,
    nothingFound: { type: String, default: "Nothing found" },
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = useId();
    const id = `dui-combobox-${generatedId}`;
    const listId = `${id}-listbox`;
    const open = ref(false);
    const query = ref("");
    const activeIndex = ref(-1);
    const root = ref<HTMLElement>();
    const selectedValues = computed(() =>
      props.multiple
        ? Array.isArray(props.modelValue)
          ? [...props.modelValue]
          : []
        : props.modelValue === null ||
            Array.isArray(props.modelValue) ||
            props.modelValue === undefined
          ? []
          : [props.modelValue],
    );
    const selectedOption = computed(() =>
      props.data.find((option) => option.value === props.modelValue),
    );
    const filtered = computed(() => {
      const normalized = query.value.trim().toLocaleLowerCase();
      if (!props.searchable || !normalized) return props.data;
      return props.data.filter((option) =>
        option.label.toLocaleLowerCase().includes(normalized),
      );
    });
    const inputValue = computed(() => {
      if (props.multiple) return query.value;
      if (!props.searchable) return selectedOption.value?.label ?? "";

      // Keep the committed selection visible while closed. Once the
      // combobox is opened, the input becomes a fresh search field.
      return (
        query.value || (open.value ? "" : (selectedOption.value?.label ?? ""))
      );
    });
    const openList = () => {
      if (props.disabled) return;
      open.value = true;
      if (activeIndex.value < 0)
        activeIndex.value = filtered.value.findIndex(
          (option) => !option.disabled,
        );
    };
    const closeList = () => {
      open.value = false;
      activeIndex.value = -1;
      query.value = "";
    };
    const moveActive = (direction: 1 | -1) => {
      if (!open.value) openList();
      const options = filtered.value;
      if (!options.length) return;
      let index = activeIndex.value;
      for (let count = 0; count < options.length; count += 1) {
        index = (index + direction + options.length) % options.length;
        if (!options[index]?.disabled) {
          activeIndex.value = index;
          return;
        }
      }
    };
    const select = (option: ComboboxOption) => {
      if (props.disabled || option.disabled) return;
      if (props.multiple) {
        const values = selectedValues.value;
        const next = values.includes(option.value)
          ? values.filter((value) => value !== option.value)
          : [...values, option.value];
        emit("update:modelValue", next);
        query.value = "";
        open.value = true;
      } else {
        emit("update:modelValue", option.value);
        closeList();
      }
    };
    const clear = () => {
      if (props.disabled) return;
      emit("update:modelValue", props.multiple ? [] : null);
      emit("clear");
      query.value = "";
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open.value) openList();
        else moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === "Home" && open.value) {
        event.preventDefault();
        activeIndex.value = filtered.value.findIndex(
          (option) => !option.disabled,
        );
      } else if (event.key === "End" && open.value) {
        event.preventDefault();
        for (let index = filtered.value.length - 1; index >= 0; index -= 1) {
          if (!filtered.value[index]?.disabled) {
            activeIndex.value = index;
            break;
          }
        }
      } else if (
        event.key === "Enter" &&
        open.value &&
        activeIndex.value >= 0
      ) {
        event.preventDefault();
        const option = filtered.value[activeIndex.value];
        if (option) select(option);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeList();
      } else if (
        event.key === "Backspace" &&
        props.multiple &&
        !query.value &&
        selectedValues.value.length
      ) {
        emit("update:modelValue", selectedValues.value.slice(0, -1));
      }
    };
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
            h(
              "div",
              {
                ref: root,
                class: ["dui-Combobox", attrs.class],
                "data-dui-component": "Combobox",
                "data-open": open.value ? "true" : undefined,
                "data-multiple": props.multiple ? "true" : undefined,
              },
              [
                h("input", {
                  ...attrs,
                  id,
                  role: "combobox",
                  value: inputValue.value,
                  readonly: !props.searchable,
                  disabled: props.disabled,
                  required: props.required,
                  placeholder: props.placeholder,
                  autocomplete: "off",
                  "aria-label": props.label ? undefined : props.ariaLabel,
                  "aria-expanded": String(open.value),
                  "aria-controls": open.value ? listId : undefined,
                  "aria-activedescendant":
                    activeIndex.value >= 0
                      ? `${listId}-${activeIndex.value}`
                      : undefined,
                  "aria-invalid": props.error ? "true" : undefined,
                  "aria-describedby": describedBy,
                  "data-dui-combobox-input": "",
                  class: "dui-Combobox-input",
                  style: {
                    borderRadius: radiusToken(props.radius),
                    fontSize: fontSizeToken(props.size),
                  },
                  onFocus: openList,
                  onClick: openList,
                  onInput: (event: Event) => {
                    query.value = (event.target as HTMLInputElement).value;
                    openList();
                  },
                  onKeydown,
                }),
                props.clearable && selectedValues.value.length
                  ? h(
                      "button",
                      {
                        type: "button",
                        class: "dui-Combobox-clear",
                        "aria-label": "Clear selection",
                        onClick: clear,
                      },
                      "×",
                    )
                  : null,
                props.multiple && selectedValues.value.length
                  ? h(
                      "div",
                      { class: "dui-Combobox-values", "aria-hidden": "true" },
                      selectedValues.value.map(
                        (value) =>
                          props.data.find((option) => option.value === value)
                            ?.label ?? String(value),
                      ),
                    )
                  : null,
                open.value
                  ? h(
                      "ul",
                      {
                        id: listId,
                        role: "listbox",
                        "aria-multiselectable": props.multiple
                          ? "true"
                          : undefined,
                        class: "dui-Combobox-dropdown",
                      },
                      filtered.value.length
                        ? filtered.value.map((option, index) =>
                            h(
                              "li",
                              {
                                id: `${listId}-${index}`,
                                role: "option",
                                "aria-selected": String(
                                  selectedValues.value.includes(option.value),
                                ),
                                "aria-disabled": option.disabled
                                  ? "true"
                                  : undefined,
                                class: [
                                  "dui-Combobox-option",
                                  activeIndex.value === index
                                    ? "is-active"
                                    : undefined,
                                ],
                                onMouseenter: () => {
                                  activeIndex.value = index;
                                },
                                onMousedown: (event: MouseEvent) =>
                                  event.preventDefault(),
                                onClick: () => select(option),
                              },
                              slots.option
                                ? slots.option({ option })
                                : option.label,
                            ),
                          )
                        : h(
                            "li",
                            { class: "dui-Combobox-empty" },
                            slots.empty?.() ?? props.nothingFound,
                          ),
                    )
                  : null,
              ],
            ),
        },
      );
  },
});
