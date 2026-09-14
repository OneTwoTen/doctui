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
import { Calendar } from "./Calendar";
import { DateInput } from "./DateInput";
import type { DateValue } from "./date-utils";

export const DatePicker = defineComponent({
  name: "DuiDatePicker",
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
    locale: { type: String, default: "en-US" },
    firstDayOfWeek: { type: Number, default: 0 },
  },
  emits: ["update:modelValue", "select", "blur", "clear"],
  setup(props, { emit }) {
    const uid = useId();
    const calendarId = `dui-date-picker-calendar-${uid}`;
    const opened = ref(false);
    const root = ref<HTMLElement | null>(null);
    const toggle = ref<HTMLButtonElement | null>(null);

    const focusActiveDay = async () => {
      await nextTick();
      root.value
        ?.querySelector<HTMLButtonElement>('[role="gridcell"][tabindex="0"]')
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

    const toggleCalendar = async () => {
      if (props.disabled) return;
      opened.value = !opened.value;
      if (opened.value) await focusActiveDay();
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

    return () => {
      const inputProps = {
        ...(props.id !== undefined ? { id: props.id } : {}),
        ...(props.label !== undefined ? { label: props.label } : {}),
        ...(props.description !== undefined
          ? { description: props.description }
          : {}),
        ...(props.error !== undefined ? { error: props.error } : {}),
        ...(props.ariaLabel !== undefined
          ? { ariaLabel: props.ariaLabel }
          : {}),
        modelValue: props.modelValue,
        ...(props.minDate !== undefined ? { minDate: props.minDate } : {}),
        ...(props.maxDate !== undefined ? { maxDate: props.maxDate } : {}),
        disabled: props.disabled,
        clearable: props.clearable,
        "onUpdate:modelValue": (value: DateValue) =>
          emit("update:modelValue", value),
        onBlur: (event: FocusEvent) => emit("blur", event),
        onClear: () => emit("clear"),
      };

      return h(
        "div",
        {
          ref: root,
          class: "dui-DatePicker",
          "data-has-label": Boolean(props.label),
          "data-disabled": props.disabled || undefined,
        },
        [
          h(DateInput, inputProps),
          h(
            "button",
            {
              ref: toggle,
              type: "button",
              class: "dui-DatePicker__toggle",
              "aria-label": opened.value ? "Close calendar" : "Open calendar",
              "aria-expanded": opened.value,
              "aria-controls": calendarId,
              "aria-haspopup": "grid",
              disabled: props.disabled,
              onClick: toggleCalendar,
            },
            "▣",
          ),
          opened.value
            ? h(Calendar, {
                id: calendarId,
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
                "onUpdate:modelValue": (value: DateValue) => {
                  emit("update:modelValue", value);
                  emit("select", value);
                  void close(true);
                },
              })
            : null,
        ],
      );
    };
  },
});
