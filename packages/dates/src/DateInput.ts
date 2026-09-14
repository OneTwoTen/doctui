import { type Radius, type Size, TextInput } from "@doctui/core";
import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  useId,
  watch,
} from "vue";
import {
  type DateValue,
  isOutsideRange,
  parseDate,
  toDateValue,
} from "./date-utils";
import { calendarIcon, xIcon } from "./icons";
import { PickerDatePanel } from "./PickerDatePanel";

function dateFormatter(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatEditableDate(value: DateValue, locale: string) {
  const date = parseDate(value);
  return date ? dateFormatter(locale).format(date) : "";
}

function datePlaceholder(locale: string) {
  return dateFormatter(locale)
    .formatToParts(new Date(2006, 10, 22))
    .map((part) => {
      if (part.type === "day") return "DD";
      if (part.type === "month") return "MM";
      if (part.type === "year") return "YYYY";
      return part.value;
    })
    .join("");
}

function parseEditableDate(value: string, locale: string): DateValue {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoDate = parseDate(trimmed);
  if (isoDate) return toDateValue(isoDate);

  const groups = trimmed.match(/\d+/g);
  if (groups?.length !== 3) return null;

  const order = dateFormatter(locale)
    .formatToParts(new Date(2006, 10, 22))
    .filter((part) => ["day", "month", "year"].includes(part.type))
    .map((part) => part.type);
  if (order.length !== 3) return null;

  const values: Record<string, string> = {};
  order.forEach((part, index) => {
    const group = groups[index];
    if (group) values[part] = group;
  });

  const year = values.year;
  const month = values.month;
  const day = values.day;
  if (year?.length !== 4 || !month || !day) return null;

  const normalized = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return parseDate(normalized) ? normalized : null;
}

export const DateInput = defineComponent({
  name: "DuiDateInput",
  props: {
    id: { type: String, default: undefined },
    modelValue: { type: String as PropType<DateValue>, default: null },
    label: { type: String, default: undefined },
    description: { type: String, default: undefined },
    error: { type: String, default: undefined },
    ariaLabel: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    locale: { type: String, default: "en-US" },
    firstDayOfWeek: { type: Number, default: 0 },
    disabled: Boolean,
    clearable: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  emits: ["update:modelValue", "select", "blur", "clear"],
  setup(props, { emit }) {
    const uid = useId();
    const panelId = `dui-date-input-panel-${uid}`;
    const root = ref<HTMLElement | null>(null);
    const toggle = ref<HTMLButtonElement | null>(null);
    const opened = ref(false);
    const focused = ref(false);
    const inputText = ref(formatEditableDate(props.modelValue, props.locale));

    const syncText = () => {
      if (!focused.value) {
        inputText.value = formatEditableDate(props.modelValue, props.locale);
      }
    };

    watch(() => props.modelValue, syncText);
    watch(() => props.locale, syncText);
    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) opened.value = false;
      },
    );

    const focusActiveOption = async () => {
      await nextTick();
      root.value
        ?.querySelector<HTMLButtonElement>(
          '[role="gridcell"][tabindex="0"], [role="option"][tabindex="0"]',
        )
        ?.focus();
    };

    const close = async (restoreFocus = false) => {
      if (!opened.value) return;
      opened.value = false;
      if (restoreFocus) {
        await nextTick();
        toggle.value?.focus();
      }
    };

    const open = async () => {
      if (props.disabled || opened.value) return;
      opened.value = true;
      await focusActiveOption();
    };

    const togglePanel = () => {
      if (opened.value) void close(false);
      else void open();
    };

    const onDocumentPointerDown = (event: Event) => {
      if (!opened.value) return;
      const target = event.target;
      if (target instanceof Node && root.value?.contains(target)) return;
      void close(false);
    };

    const onDocumentKeydown = (event: KeyboardEvent) => {
      if (opened.value && event.key === "Escape") {
        event.preventDefault();
        void close(true);
      }
    };

    onMounted(() => {
      document.addEventListener("pointerdown", onDocumentPointerDown);
      document.addEventListener("keydown", onDocumentKeydown);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("pointerdown", onDocumentPointerDown);
      document.removeEventListener("keydown", onDocumentKeydown);
    });

    const commitTypedValue = (value: string) => {
      inputText.value = value;
      if (!value.trim()) {
        emit("update:modelValue", null);
        return;
      }

      const parsed = parseEditableDate(value, props.locale);
      if (parsed && !isOutsideRange(parsed, props.minDate, props.maxDate)) {
        emit("update:modelValue", parsed);
      }
    };

    const normalizeOnBlur = (event: FocusEvent) => {
      focused.value = false;
      const parsed = parseEditableDate(inputText.value, props.locale);
      if (parsed && !isOutsideRange(parsed, props.minDate, props.maxDate)) {
        inputText.value = formatEditableDate(parsed, props.locale);
        emit("update:modelValue", parsed);
      } else if (!inputText.value.trim()) {
        inputText.value = "";
      } else {
        inputText.value = formatEditableDate(props.modelValue, props.locale);
      }
      emit("blur", event);
    };

    const clear = () => {
      if (props.disabled) return;
      inputText.value = "";
      emit("update:modelValue", null);
      emit("clear");
    };

    return () =>
      h(
        "div",
        {
          ref: root,
          class: "dui-DatePicker dui-DateInput",
          "data-disabled": props.disabled ? "true" : undefined,
          "data-opened": opened.value ? "true" : undefined,
          "data-size": props.size,
        },
        [
          h(
            TextInput,
            {
              class: "dui-DatePicker__field dui-DateInput__field",
              ...(props.id !== undefined ? { id: props.id } : {}),
              modelValue: inputText.value,
              ...(props.label !== undefined ? { label: props.label } : {}),
              ...(props.description !== undefined
                ? { description: props.description }
                : {}),
              ...(props.error !== undefined ? { error: props.error } : {}),
              placeholder: props.placeholder ?? datePlaceholder(props.locale),
              size: props.size,
              radius: props.radius,
              disabled: props.disabled,
              type: "text",
              inputmode: "numeric",
              autocomplete: "off",
              "aria-label": props.label
                ? undefined
                : (props.ariaLabel ?? "Date"),
              "aria-expanded": opened.value ? "true" : "false",
              "aria-controls": panelId,
              "aria-haspopup": "dialog",
              "onUpdate:modelValue": commitTypedValue,
              onFocus: () => {
                focused.value = true;
              },
              onBlur: normalizeOnBlur,
              onKeydown: (event: KeyboardEvent) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  void open();
                }
              },
            },
            {
              rightSection: () =>
                h("div", { class: "dui-DatePicker__actions" }, [
                  props.clearable && (props.modelValue || inputText.value)
                    ? h(
                        "button",
                        {
                          type: "button",
                          class:
                            "dui-DatePicker__action dui-DatePicker__clear dui-DateInput__clear",
                          "aria-label": "Clear date",
                          disabled: props.disabled,
                          onClick: (event: Event) => {
                            event.stopPropagation();
                            clear();
                          },
                        },
                        xIcon(),
                      )
                    : null,
                  h(
                    "button",
                    {
                      ref: toggle,
                      type: "button",
                      class:
                        "dui-DatePicker__action dui-DatePicker__toggle dui-DateInput__toggle",
                      "aria-label": opened.value
                        ? "Close date picker"
                        : "Open date picker",
                      "aria-expanded": opened.value ? "true" : "false",
                      "aria-controls": panelId,
                      "aria-haspopup": "dialog",
                      disabled: props.disabled,
                      onClick: (event: Event) => {
                        event.stopPropagation();
                        togglePanel();
                      },
                    },
                    calendarIcon(),
                  ),
                ]),
            },
          ),
          opened.value
            ? h(PickerDatePanel, {
                id: panelId,
                class: "dui-DateInput__panel",
                modelValue: props.modelValue,
                ...(props.minDate !== undefined
                  ? { minDate: props.minDate }
                  : {}),
                ...(props.maxDate !== undefined
                  ? { maxDate: props.maxDate }
                  : {}),
                locale: props.locale,
                firstDayOfWeek: props.firstDayOfWeek,
                disabled: props.disabled,
                ariaLabel: "Choose date",
                "onUpdate:modelValue": (value: DateValue) => {
                  inputText.value = formatEditableDate(value, props.locale);
                  emit("update:modelValue", value);
                },
                onSelect: (value: DateValue) => {
                  inputText.value = formatEditableDate(value, props.locale);
                  emit("select", value);
                  void close(true);
                },
              })
            : null,
        ],
      );
  },
});
