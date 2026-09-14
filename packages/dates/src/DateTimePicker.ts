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
import { parseDate, toDateValue } from "./date-utils";
import { calendarIcon, xIcon } from "./icons";
import { PickerDatePanel } from "./PickerDatePanel";

interface ParsedDateTime {
  date: string;
  hour: number;
  minute: number;
}

function parseDateTime(value: string): ParsedDateTime | null {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const date = match[1];
  const hour = Number(match[2]);
  const minute = Number(match[3]);
  if (!date || !parseDate(date) || hour > 23 || minute > 59) return null;

  return { date, hour, minute };
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

function displayDateTime(value: string, locale: string) {
  const parsed = parseDateTime(value);
  if (!parsed) return "";
  const date = parseDate(parsed.date);
  if (!date) return "";
  date.setHours(parsed.hour, parsed.minute, 0, 0);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const DateTimePicker = defineComponent({
  name: "DuiDateTimePicker",
  props: {
    id: { type: String, default: undefined },
    modelValue: { type: String, default: "" },
    label: { type: String, default: undefined },
    description: { type: String, default: undefined },
    error: { type: String, default: undefined },
    ariaLabel: { type: String, default: undefined },
    placeholder: { type: String, default: "Select date and time" },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    locale: { type: String, default: "en-US" },
    firstDayOfWeek: { type: Number, default: 0 },
    disabled: Boolean,
    clearable: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  emits: ["update:modelValue", "blur", "clear"],
  setup(props, { emit }) {
    const uid = useId();
    const panelId = `dui-date-time-picker-panel-${uid}`;
    const root = ref<HTMLElement | null>(null);
    const toggle = ref<HTMLButtonElement | null>(null);
    const opened = ref(false);
    const draftDate = ref("");
    const draftHour = ref("00");
    const draftMinute = ref("00");

    const syncDraft = () => {
      const parsed = parseDateTime(props.modelValue);
      const now = new Date();
      draftDate.value = parsed?.date ?? toDateValue(now);
      draftHour.value = twoDigits(parsed?.hour ?? now.getHours());
      draftMinute.value = twoDigits(parsed?.minute ?? now.getMinutes());
    };

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
      syncDraft();
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
    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) void close(false);
      },
    );

    const updateTimePart = (target: "hour" | "minute", value: string) => {
      const normalized = value.replace(/\D/g, "").slice(0, 2);
      if (target === "hour") draftHour.value = normalized;
      else draftMinute.value = normalized;
    };

    const useCurrentDateTime = () => {
      const now = new Date();
      draftDate.value = toDateValue(now);
      draftHour.value = twoDigits(now.getHours());
      draftMinute.value = twoDigits(now.getMinutes());
    };

    const apply = () => {
      if (!parseDate(draftDate.value)) return;
      const hour = Math.min(23, Math.max(0, Number(draftHour.value) || 0));
      const minute = Math.min(59, Math.max(0, Number(draftMinute.value) || 0));
      emit(
        "update:modelValue",
        `${draftDate.value}T${twoDigits(hour)}:${twoDigits(minute)}`,
      );
      void close(true);
    };

    return () =>
      h(
        "div",
        {
          ref: root,
          class: "dui-DatePicker dui-DateTimePicker",
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
              modelValue: displayDateTime(props.modelValue, props.locale),
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
                : (props.ariaLabel ?? "Date and time"),
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
                          "aria-label": "Clear date and time",
                          disabled: props.disabled,
                          onClick: (event: Event) => {
                            event.stopPropagation();
                            if (props.disabled) return;
                            emit("update:modelValue", "");
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
                        ? "Close date and time picker"
                        : "Open date and time picker",
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
            ? h(
                PickerDatePanel,
                {
                  id: panelId,
                  class: "dui-DateTimePicker__panel",
                  modelValue: draftDate.value,
                  ...(props.minDate !== undefined
                    ? { minDate: props.minDate }
                    : {}),
                  ...(props.maxDate !== undefined
                    ? { maxDate: props.maxDate }
                    : {}),
                  locale: props.locale,
                  firstDayOfWeek: props.firstDayOfWeek,
                  disabled: props.disabled,
                  ariaLabel: "Choose date and time",
                  "onUpdate:modelValue": (value: string | null) => {
                    if (value) draftDate.value = value;
                  },
                },
                {
                  footer: () =>
                    h("div", { class: "dui-DateTimePicker__footer" }, [
                      h("div", { class: "dui-DateTimePicker__time" }, [
                        h("span", { class: "dui-DateTimePicker__timeLabel" }, "Time"),
                        h("div", { class: "dui-DateTimePicker__timeFields" }, [
                          h("input", {
                            class: "dui-DateTimePicker__timeInput",
                            value: draftHour.value,
                            inputmode: "numeric",
                            maxlength: 2,
                            "aria-label": "Hour",
                            onInput: (event: Event) =>
                              updateTimePart(
                                "hour",
                                (event.target as HTMLInputElement).value,
                              ),
                          }),
                          h("span", { "aria-hidden": "true" }, ":"),
                          h("input", {
                            class: "dui-DateTimePicker__timeInput",
                            value: draftMinute.value,
                            inputmode: "numeric",
                            maxlength: 2,
                            "aria-label": "Minute",
                            onInput: (event: Event) =>
                              updateTimePart(
                                "minute",
                                (event.target as HTMLInputElement).value,
                              ),
                          }),
                        ]),
                      ]),
                      h("div", { class: "dui-DateTimePicker__footerActions" }, [
                        h(
                          "button",
                          {
                            type: "button",
                            class: "dui-DateTimePicker__footerButton",
                            onClick: useCurrentDateTime,
                          },
                          "Now",
                        ),
                        h(
                          "button",
                          {
                            type: "button",
                            class:
                              "dui-DateTimePicker__footerButton dui-DateTimePicker__footerButton--primary",
                            onClick: apply,
                          },
                          "Apply",
                        ),
                      ]),
                    ]),
                },
              )
            : null,
        ],
      );
  },
});
