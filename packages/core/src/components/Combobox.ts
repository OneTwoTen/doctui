import {
  computed,
  defineComponent,
  h,
  mergeProps,
  nextTick,
  type PropType,
  ref,
  watch,
} from "vue";
import type { Radius, Size } from "../theme/types";
import {
  composeDescribedBy,
  getFieldRootStateAttrs,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
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
  id?: string;
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

function firstEnabledIndex(options: readonly ComboboxOption[]) {
  return options.findIndex((option) => !option.disabled);
}

function lastEnabledIndex(options: readonly ComboboxOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) return index;
  }
  return -1;
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
    id: String,
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
    const open = ref(false);
    const query = ref("");
    const activeValue = ref<string | number>();
    const listbox = ref<HTMLElement>();

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
    const activeIndex = computed(() =>
      activeValue.value === undefined
        ? -1
        : filtered.value.findIndex(
            (option) => !option.disabled && option.value === activeValue.value,
          ),
    );
    const inputValue = computed(() => {
      if (!props.searchable) return selectedOption.value?.label ?? "";
      if (props.multiple || open.value) return query.value;
      return selectedOption.value?.label ?? query.value;
    });
    const accessibleLabel = computed(() => {
      if (props.ariaLabel) return props.ariaLabel;
      if (props.label) return undefined;
      return props.multiple ? "Select options" : "Select option";
    });

    const setActiveIndex = (index: number) => {
      const option = filtered.value[index];
      activeValue.value = option && !option.disabled ? option.value : undefined;
    };

    const syncActiveOption = () => {
      if (!open.value) return;
      if (
        activeValue.value !== undefined &&
        filtered.value.some(
          (option) => option.value === activeValue.value && !option.disabled,
        )
      ) {
        return;
      }
      setActiveIndex(firstEnabledIndex(filtered.value));
    };

    const openList = (entry: "first" | "last" = "first") => {
      if (props.disabled) return;
      open.value = true;
      if (activeIndex.value >= 0) return;

      const selectedIndex = filtered.value.findIndex(
        (option) =>
          !option.disabled && selectedValues.value.includes(option.value),
      );
      if (selectedIndex >= 0) {
        setActiveIndex(selectedIndex);
        return;
      }

      setActiveIndex(
        entry === "last"
          ? lastEnabledIndex(filtered.value)
          : firstEnabledIndex(filtered.value),
      );
    };

    const closeList = () => {
      open.value = false;
      activeValue.value = undefined;
      query.value = "";
    };

    const moveActive = (direction: 1 | -1) => {
      const options = filtered.value;
      if (!options.length) {
        activeValue.value = undefined;
        return;
      }

      let index = activeIndex.value;
      if (index < 0) {
        setActiveIndex(
          direction === 1
            ? firstEnabledIndex(options)
            : lastEnabledIndex(options),
        );
        return;
      }

      for (let count = 0; count < options.length; count += 1) {
        index = (index + direction + options.length) % options.length;
        if (!options[index]?.disabled) {
          setActiveIndex(index);
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
        activeValue.value = option.value;
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
      activeValue.value = undefined;
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (props.disabled) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open.value) openList("first");
        else moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open.value) openList("last");
        else moveActive(-1);
      } else if (event.key === "Home" && open.value) {
        event.preventDefault();
        setActiveIndex(firstEnabledIndex(filtered.value));
      } else if (event.key === "End" && open.value) {
        event.preventDefault();
        setActiveIndex(lastEnabledIndex(filtered.value));
      } else if (
        event.key === "Enter" &&
        open.value &&
        activeIndex.value >= 0
      ) {
        event.preventDefault();
        const option = filtered.value[activeIndex.value];
        if (option) select(option);
      } else if (event.key === "Escape" && open.value) {
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

    watch(filtered, syncActiveOption, { flush: "sync" });
    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) closeList();
      },
    );
    watch(activeIndex, (index) => {
      if (!open.value || index < 0) return;
      void nextTick(() => {
        const activeOption = listbox.value?.querySelector<HTMLElement>(
          `[data-dui-combobox-option-index="${index}"]`,
        );
        activeOption?.scrollIntoView?.({ block: "nearest" });
      });
    });

    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);

      return h(
        InputWrapper,
        mergeProps(
          getInputWrapperProps(props),
          rootAttrs,
          getFieldRootStateAttrs(props, "Combobox"),
        ),
        {
          default: ({
            id,
            describedBy,
          }: {
            id: string;
            describedBy?: string;
          }) => {
            const listId = `${id}-listbox`;
            const ariaDescribedBy = composeDescribedBy(
              describedBy,
              controlAttrs["aria-describedby"],
            );
            const ariaInvalid = props.error
              ? "true"
              : controlAttrs["aria-invalid"];

            return h(
              "div",
              {
                class: "dui-Combobox",
                "data-dui-component": "Combobox",
                "data-open": open.value ? "true" : undefined,
                "data-multiple": props.multiple ? "true" : undefined,
                "data-disabled": props.disabled ? "true" : undefined,
                "data-error": props.error ? "true" : undefined,
                "data-size": props.size,
              },
              [
                h(
                  "input",
                  mergeProps(controlAttrs, {
                    id,
                    role: "combobox",
                    value: inputValue.value,
                    readonly: !props.searchable,
                    disabled: props.disabled,
                    required: props.required,
                    placeholder: props.placeholder,
                    autocomplete: "off",
                    "aria-label": accessibleLabel.value,
                    "aria-haspopup": "listbox",
                    "aria-expanded": String(open.value),
                    "aria-controls": open.value ? listId : undefined,
                    "aria-activedescendant":
                      open.value && activeIndex.value >= 0
                        ? `${listId}-${activeIndex.value}`
                        : undefined,
                    "aria-invalid": ariaInvalid,
                    "aria-describedby": ariaDescribedBy,
                    "data-dui-combobox-input": "",
                    class: "dui-Combobox-input",
                    style: {
                      borderRadius: radiusToken(props.radius),
                      fontSize: fontSizeToken(props.size),
                    },
                    onFocus: () => openList("first"),
                    onClick: () => openList("first"),
                    onInput: (event: Event) => {
                      query.value = (event.target as HTMLInputElement).value;
                      openList("first");
                    },
                    onKeydown,
                  }),
                ),
                props.clearable && selectedValues.value.length
                  ? h(
                      "button",
                      {
                        type: "button",
                        class: "dui-Combobox-clear",
                        "aria-label": "Clear selection",
                        disabled: props.disabled,
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
                        ref: listbox,
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
                                "data-dui-combobox-option-index": String(index),
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
                                  if (!option.disabled) setActiveIndex(index);
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
                            {
                              class: "dui-Combobox-empty",
                              "data-dui-combobox-empty": "",
                              role: "status",
                            },
                            slots.empty?.() ?? props.nothingFound,
                          ),
                    )
                  : null,
              ],
            );
          },
        },
      );
    };
  },
});
