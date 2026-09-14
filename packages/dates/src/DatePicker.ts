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
import { type DateValue, parseDate } from "./date-utils";
import { calendarIcon, xIcon } from "./icons";
import { PickerDatePanel } from "./PickerDatePanel";

function displayDate(value: DateValue, locale: string) {
  const date = parseDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export const DatePicker = defineComponent({
  name: "DuiDatePicker",
  props: {
    id: { type: String, default: undefined },
    modelValue: { type: String as PropType<DateValue>, default: null },
    label: { type: String, default: undefined },
    description: { type: String, default: undefined },
    error: { type: String, default: undefined },
    ariaLabel: { type: String, default: undefined },
    placeholder: { type: String, default: "Select date" },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabled: Boolean,
    clearable: Boolean,
    locale: { type: String, default: "en-US" },
    firstDayOfWeek: { type: Number, default: 0 },
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  emits: ["update:modelValue", "select", "blur", "clear"],
  setup(props, { emit }) {
    const uid = useId();
    const panelId = `dui-date-picker-panel-${uid}`;
    const opened = ref(false);
    const root = ref<HTMLElement | null>(null);
    const toggle = ref<HTMLButtonElement | null>(null);

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

    const toggleCalendar = async () => {
      if (props.disabled) return;
      if (opened.value) {
        await close(false);
        return;
      }
      await open();
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
    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) void close(false);
      },
    );

    return () =>
      h(
        "div",
        {
          ref: root,
          class: "dui-DatePicker",
          "data-disabled": props.disabled ? "true" : undefined,
          "data-opened": opened.value ? "true" : undefined,
          "data-size": props.size,
        },
        [
          h(
            TextInput,
            {
              class: "dui-DatePicker__field",
              ...(props.id !== undefined ? { id: props.id } : {}),
              modelValue: displayDate(props.modelValue, props.locale),
              ...(props.label !== undefined ? { label: props.label } : {}),
              ...(props.description !== undefined
                ? { description: props.description }
                : {}),
              ...(props.error !== undefined ? { error: props.error } : {}),
              placeholder: props.placeholder,
              size: props.size,
              radius: props.radius,
              disabled: props.disabled,
              readonly: true,
              type: "text",
              "aria-label": props.label
                ? undefined
                : (props.ariaLabel ?? "Date"),
              "aria-expanded": opened.value ? "true" : "false",
              "aria-controls": panelId,
              "aria-haspopup": "dialog",
              onClick: () => void open(),
              onKeydown: (event: KeyboardEvent) => {
                if (["ArrowDown", "Enter", " "].includes(event.key)) {
                  event.preventDefault();
                  void open();
                }
              },
              onBlur: (event: FocusEvent) => emit("blur", event),
            },
            {
              rightSection: () =>
                h("div", { class: "dui-DatePicker__actions" }, [
                  props.clearable && props.modelValue
                    ? h(
                        "button",
                        {
                          type: "button",
                          class: "dui-DatePicker__action dui-DatePicker__clear",
                          "aria-label": "Clear date",
                          disabled: props.disabled,
                          onClick: (event: Event) => {
                            event.stopPropagation();
                            if (props.disabled) return;
                            emit("update:modelValue", null);
                            emit("clear");
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
                      class: "dui-DatePicker__action dui-DatePicker__toggle",
                      "aria-label": opened.value
                        ? "Close date picker"
                        : "Open date picker",
                      "aria-expanded": opened.value ? "true" : "false",
                      "aria-controls": panelId,
                      "aria-haspopup": "dialog",
                      disabled: props.disabled,
                      onClick: (event: Event) => {
                        event.stopPropagation();
                        void toggleCalendar();
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
                ariaLabel: props.ariaLabel ?? "Choose date",
                "onUpdate:modelValue": (value: DateValue) => {
                  emit("update:modelValue", value);
                },
                onSelect: (value: DateValue) => {
                  emit("select", value);
                  void close(true);
                },
              })
            : null,
        ],
      );
  },
});
