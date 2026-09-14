import "./styles.css";
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

export type DateValue = string | null;

const pad = (value: number) => String(value).padStart(2, "0");
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const toMonthValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

const parseMonth = (value?: string | null) => {
  if (!value) return null;
  const match = MONTH_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  const date = new Date(year, month - 1, 1);
  return date.getFullYear() === year && date.getMonth() === month - 1
    ? date
    : null;
};

const monthLabel = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    date,
  );

const dayLabels = (locale: string, firstDayOfWeek: number) => {
  const normalizedFirstDay = ((firstDayOfWeek % 7) + 7) % 7;
  const base = new Date(2024, 0, 7 + normalizedFirstDay);
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + index),
    ),
  );
};

const isOutsideRange = (value: string, minDate?: string, maxDate?: string) => {
  const date = parseDate(value);
  if (!date) return true;
  const min = parseDate(minDate);
  const max = parseDate(maxDate);
  return Boolean(
    (min && date.getTime() < min.getTime()) ||
      (max && date.getTime() > max.getTime()),
  );
};

const describedBy = (...ids: Array<string | undefined>) =>
  ids.filter(Boolean).join(" ") || undefined;

export const Calendar = defineComponent({
  name: "DuiCalendar",
  props: {
    id: { type: String, default: undefined },
    modelValue: { type: String as PropType<DateValue>, default: null },
    month: { type: String, default: undefined },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    locale: { type: String, default: "en-US" },
    firstDayOfWeek: { type: Number, default: 0 },
    disabled: Boolean,
    ariaLabel: { type: String, default: undefined },
  },
  emits: ["update:modelValue", "update:month", "select"],
  setup(props, { emit }) {
    const now = new Date();
    const initial =
      parseMonth(props.month) ??
      parseDate(props.modelValue) ??
      new Date(now.getFullYear(), now.getMonth(), 1);
    const visibleMonth = ref(
      new Date(initial.getFullYear(), initial.getMonth(), 1),
    );
    const root = ref<HTMLElement | null>(null);

    const firstEnabledDate = (monthDate = visibleMonth.value) => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const days = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= days; day += 1) {
        const value = toDateValue(new Date(year, month, day));
        if (!isOutsideRange(value, props.minDate, props.maxDate)) return value;
      }
      return null;
    };

    const initialSelected = parseDate(props.modelValue);
    const todayValue = toDateValue(now);
    const activeValue = ref(
      initialSelected &&
        toMonthValue(initialSelected) === toMonthValue(visibleMonth.value) &&
        !isOutsideRange(props.modelValue ?? "", props.minDate, props.maxDate)
        ? props.modelValue
        : toMonthValue(now) === toMonthValue(visibleMonth.value) &&
            !isOutsideRange(todayValue, props.minDate, props.maxDate)
          ? todayValue
          : firstEnabledDate(),
    );

    const setVisibleMonth = (date: Date, notify = true) => {
      const next = new Date(date.getFullYear(), date.getMonth(), 1);
      visibleMonth.value = next;
      if (notify) emit("update:month", toMonthValue(next));
    };

    const ensureActiveValue = () => {
      const selected = parseDate(props.modelValue);
      if (
        selected &&
        toMonthValue(selected) === toMonthValue(visibleMonth.value) &&
        !isOutsideRange(props.modelValue ?? "", props.minDate, props.maxDate)
      ) {
        activeValue.value = props.modelValue;
        return;
      }
      const current = parseDate(activeValue.value);
      if (
        current &&
        toMonthValue(current) === toMonthValue(visibleMonth.value) &&
        !isOutsideRange(activeValue.value ?? "", props.minDate, props.maxDate)
      ) {
        return;
      }
      activeValue.value = firstEnabledDate();
    };

    watch(
      () => props.month,
      (value) => {
        const next = parseMonth(value);
        if (next) {
          setVisibleMonth(next, false);
          ensureActiveValue();
        }
      },
    );
    watch(
      () => props.modelValue,
      () => ensureActiveValue(),
    );
    watch(
      () => [props.minDate, props.maxDate] as const,
      () => ensureActiveValue(),
    );

    const setMonth = (offset: number) => {
      if (props.disabled) return;
      setVisibleMonth(
        new Date(
          visibleMonth.value.getFullYear(),
          visibleMonth.value.getMonth() + offset,
          1,
        ),
      );
      nextTick(() => {
        activeValue.value = firstEnabledDate();
      });
    };

    const select = (value: string) => {
      if (
        props.disabled ||
        isOutsideRange(value, props.minDate, props.maxDate)
      ) {
        return;
      }
      activeValue.value = value;
      emit("update:modelValue", value);
      emit("select", value);
    };

    const focusDate = async (date: Date) => {
      const value = toDateValue(date);
      if (isOutsideRange(value, props.minDate, props.maxDate)) return;
      if (toMonthValue(date) !== toMonthValue(visibleMonth.value)) {
        setVisibleMonth(date);
      }
      activeValue.value = value;
      await nextTick();
      root.value
        ?.querySelector<HTMLButtonElement>(`button[data-date="${value}"]`)
        ?.focus();
    };

    const onDayKeydown = async (event: KeyboardEvent, value: string) => {
      if (props.disabled) return;
      const date = parseDate(value);
      if (!date) return;
      const normalizedFirstDay = ((props.firstDayOfWeek % 7) + 7) % 7;
      const relativeDay = (date.getDay() - normalizedFirstDay + 7) % 7;
      let next: Date | null = null;

      switch (event.key) {
        case "ArrowRight":
          next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
          break;
        case "ArrowLeft":
          next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
          break;
        case "ArrowDown":
          next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
          break;
        case "ArrowUp":
          next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
          break;
        case "Home":
          next = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - relativeDay,
          );
          break;
        case "End":
          next = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + (6 - relativeDay),
          );
          break;
        case "PageUp":
          next = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
          break;
        case "PageDown":
          next = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
          break;
        default:
          return;
      }

      event.preventDefault();
      await focusDate(next);
    };

    return () => {
      const year = visibleMonth.value.getFullYear();
      const month = visibleMonth.value.getMonth();
      const normalizedFirstDay = ((props.firstDayOfWeek % 7) + 7) % 7;
      const offset =
        (new Date(year, month, 1).getDay() - normalizedFirstDay + 7) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      const weekCount = Math.ceil((offset + days) / 7);
      const today = toDateValue(new Date());
      const rows = Array.from({ length: weekCount }, (_, rowIndex) =>
        h(
          "div",
          { class: "dui-Calendar__row", role: "row" },
          Array.from({ length: 7 }, (_, columnIndex) => {
            const cellIndex = rowIndex * 7 + columnIndex;
            const day = cellIndex - offset + 1;
            if (day < 1 || day > days) {
              return h("span", {
                class: "dui-Calendar__empty",
                role: "gridcell",
              });
            }
            const value = toDateValue(new Date(year, month, day));
            const selected = props.modelValue === value;
            const disabled =
              props.disabled ||
              isOutsideRange(value, props.minDate, props.maxDate);
            return h(
              "button",
              {
                type: "button",
                class: "dui-Calendar__day",
                role: "gridcell",
                "aria-label": value,
                "aria-selected": selected ? "true" : "false",
                "aria-current": value === today ? "date" : undefined,
                disabled,
                tabindex: !disabled && activeValue.value === value ? 0 : -1,
                "data-date": value,
                "data-selected": selected || undefined,
                onClick: () => select(value),
                onFocus: () => {
                  if (!disabled) activeValue.value = value;
                },
                onKeydown: (event: KeyboardEvent) => onDayKeydown(event, value),
              },
              String(day),
            );
          }),
        ),
      );

      return h(
        "div",
        {
          id: props.id,
          ref: root,
          class: "dui-Calendar",
          "data-disabled": props.disabled || undefined,
        },
        [
          h("div", { class: "dui-Calendar__header" }, [
            h(
              "button",
              {
                type: "button",
                class: "dui-Calendar__nav",
                "aria-label": "Previous month",
                disabled: props.disabled,
                onClick: () => setMonth(-1),
              },
              "‹",
            ),
            h(
              "strong",
              { "aria-live": "polite" },
              monthLabel(visibleMonth.value, props.locale),
            ),
            h(
              "button",
              {
                type: "button",
                class: "dui-Calendar__nav",
                "aria-label": "Next month",
                disabled: props.disabled,
                onClick: () => setMonth(1),
              },
              "›",
            ),
          ]),
          h(
            "div",
            {
              class: "dui-Calendar__grid",
              role: "grid",
              "aria-label": props.ariaLabel ?? monthLabel(visibleMonth.value, props.locale),
              "aria-disabled": props.disabled ? "true" : undefined,
            },
            [
              h(
                "div",
                { class: "dui-Calendar__weekdays", role: "row" },
                dayLabels(props.locale, props.firstDayOfWeek).map((label) =>
                  h("span", { role: "columnheader" }, label),
                ),
              ),
              ...rows,
            ],
          ),
        ],
      );
    };
  },
});

export const DateInput = defineComponent({
  name: "DuiDateInput",
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
  },
  emits: ["update:modelValue", "blur", "clear"],
  setup(props, { emit }) {
    const uid = useId();
    const inputId = props.id ?? `dui-date-${uid}`;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return () =>
      h("div", { class: "dui-DateInput", "data-disabled": props.disabled || undefined }, [
        props.label
          ? h(
              "label",
              { class: "dui-DateInput__label", for: inputId },
              props.label,
            )
          : null,
        props.description
          ? h(
              "div",
              { id: descriptionId, class: "dui-DateInput__description" },
              props.description,
            )
          : null,
        h("div", { class: "dui-DateInput__control" }, [
          h("input", {
            id: inputId,
            class: "dui-DateInput__input",
            type: "date",
            value: props.modelValue ?? "",
            min: props.minDate,
            max: props.maxDate,
            disabled: props.disabled,
            "aria-label": props.label ? undefined : (props.ariaLabel ?? "Date"),
            "aria-describedby": describedBy(
              props.description ? descriptionId : undefined,
              props.error ? errorId : undefined,
            ),
            "aria-invalid": props.error ? "true" : undefined,
            onInput: (event: Event) => {
              const value = (event.target as HTMLInputElement).value;
              emit("update:modelValue", value && parseDate(value) ? value : null);
            },
            onBlur: (event: FocusEvent) => emit("blur", event),
          }),
          props.clearable && props.modelValue
            ? h(
                "button",
                {
                  type: "button",
                  class: "dui-DateInput__clear",
                  "aria-label": "Clear date",
                  disabled: props.disabled,
                  onClick: () => {
                    if (props.disabled) return;
                    emit("update:modelValue", null);
                    emit("clear");
                  },
                },
                "×",
              )
            : null,
        ]),
        props.error
          ? h(
              "div",
              { id: errorId, class: "dui-DateInput__error", role: "alert" },
              props.error,
            )
          : null,
      ]);
  },
});

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
        ...(props.ariaLabel !== undefined ? { ariaLabel: props.ariaLabel } : {}),
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
  },
  emits: ["update:modelValue", "blur", "clear"],
  setup(props, { emit }) {
    const uid = useId();
    const inputId = props.id ?? `dui-datetime-${uid}`;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return () =>
      h("div", { class: "dui-DateInput", "data-disabled": props.disabled || undefined }, [
        props.label
          ? h(
              "label",
              { class: "dui-DateInput__label", for: inputId },
              props.label,
            )
          : null,
        props.description
          ? h(
              "div",
              { id: descriptionId, class: "dui-DateInput__description" },
              props.description,
            )
          : null,
        h("div", { class: "dui-DateInput__control" }, [
          h("input", {
            id: inputId,
            class: "dui-DateInput__input",
            type: "datetime-local",
            value: props.modelValue,
            disabled: props.disabled,
            "aria-label": props.label
              ? undefined
              : (props.ariaLabel ?? "Date and time"),
            "aria-describedby": describedBy(
              props.description ? descriptionId : undefined,
              props.error ? errorId : undefined,
            ),
            "aria-invalid": props.error ? "true" : undefined,
            onInput: (event: Event) =>
              emit("update:modelValue", (event.target as HTMLInputElement).value),
            onBlur: (event: FocusEvent) => emit("blur", event),
          }),
          props.clearable && props.modelValue
            ? h(
                "button",
                {
                  type: "button",
                  class: "dui-DateInput__clear",
                  "aria-label": "Clear date and time",
                  disabled: props.disabled,
                  onClick: () => {
                    if (props.disabled) return;
                    emit("update:modelValue", "");
                    emit("clear");
                  },
                },
                "×",
              )
            : null,
        ]),
        props.error
          ? h(
              "div",
              { id: errorId, class: "dui-DateInput__error", role: "alert" },
              props.error,
            )
          : null,
      ]);
  },
});

function listboxKeydown(
  event: KeyboardEvent,
  index: number,
  count: number,
  focus: (index: number) => void,
) {
  let next: number | null = null;
  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = Math.min(count - 1, index + 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = Math.max(0, index - 1);
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = count - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  focus(next);
}

export const MonthPicker = defineComponent({
  name: "DuiMonthPicker",
  props: {
    modelValue: { type: String, default: "" },
    year: { type: Number, default: () => new Date().getFullYear() },
    locale: { type: String, default: "en-US" },
    disabled: Boolean,
    ariaLabel: { type: String, default: "Choose month" },
  },
  emits: ["update:modelValue", "select"],
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null);
    const selectedMonth = () => {
      const parsed = parseMonth(props.modelValue);
      return parsed && parsed.getFullYear() === props.year ? parsed.getMonth() : 0;
    };
    const activeIndex = ref(selectedMonth());

    watch(
      () => [props.modelValue, props.year] as const,
      () => {
        activeIndex.value = selectedMonth();
      },
    );

    const focusOption = async (index: number) => {
      if (props.disabled) return;
      activeIndex.value = index;
      await nextTick();
      root.value
        ?.querySelectorAll<HTMLButtonElement>('[role="option"]')
        .item(index)
        ?.focus();
    };

    return () =>
      h(
        "div",
        {
          ref: root,
          class: "dui-DatePicker__options",
          role: "listbox",
          "aria-label": props.ariaLabel,
          "aria-disabled": props.disabled ? "true" : undefined,
        },
        Array.from({ length: 12 }, (_, index) => {
          const date = new Date(props.year, index, 1);
          const value = toMonthValue(date);
          const selected = props.modelValue === value;
          return h(
            "button",
            {
              type: "button",
              class: "dui-DatePicker__option",
              role: "option",
              "aria-selected": selected ? "true" : "false",
              "data-selected": selected || undefined,
              tabindex: activeIndex.value === index ? 0 : -1,
              disabled: props.disabled,
              onFocus: () => (activeIndex.value = index),
              onKeydown: (event: KeyboardEvent) =>
                listboxKeydown(event, index, 12, (next) => {
                  void focusOption(next);
                }),
              onClick: () => {
                if (props.disabled) return;
                emit("update:modelValue", value);
                emit("select", value);
              },
            },
            new Intl.DateTimeFormat(props.locale, { month: "short" }).format(
              date,
            ),
          );
        }),
      );
  },
});

export const YearPicker = defineComponent({
  name: "DuiYearPicker",
  props: {
    modelValue: { type: Number as PropType<number | null>, default: null },
    minYear: { type: Number, default: () => new Date().getFullYear() - 5 },
    maxYear: { type: Number, default: () => new Date().getFullYear() + 5 },
    disabled: Boolean,
    ariaLabel: { type: String, default: "Choose year" },
  },
  emits: ["update:modelValue", "select"],
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null);
    const count = () => Math.max(0, props.maxYear - props.minYear + 1);
    const selectedIndex = () =>
      props.modelValue !== null &&
      props.modelValue >= props.minYear &&
      props.modelValue <= props.maxYear
        ? props.modelValue - props.minYear
        : 0;
    const activeIndex = ref(selectedIndex());

    watch(
      () => [props.modelValue, props.minYear, props.maxYear] as const,
      () => {
        activeIndex.value = Math.min(
          Math.max(0, selectedIndex()),
          Math.max(0, count() - 1),
        );
      },
    );

    const focusOption = async (index: number) => {
      if (props.disabled) return;
      activeIndex.value = index;
      await nextTick();
      root.value
        ?.querySelectorAll<HTMLButtonElement>('[role="option"]')
        .item(index)
        ?.focus();
    };

    return () => {
      const optionCount = count();
      return h(
        "div",
        {
          ref: root,
          class: "dui-DatePicker__options",
          role: "listbox",
          "aria-label": props.ariaLabel,
          "aria-disabled": props.disabled ? "true" : undefined,
        },
        Array.from({ length: optionCount }, (_, index) => {
          const year = props.minYear + index;
          const selected = props.modelValue === year;
          return h(
            "button",
            {
              type: "button",
              class: "dui-DatePicker__option",
              role: "option",
              "aria-selected": selected ? "true" : "false",
              "data-selected": selected || undefined,
              tabindex: activeIndex.value === index ? 0 : -1,
              disabled: props.disabled,
              onFocus: () => (activeIndex.value = index),
              onKeydown: (event: KeyboardEvent) =>
                listboxKeydown(event, index, optionCount, (next) => {
                  void focusOption(next);
                }),
              onClick: () => {
                if (props.disabled) return;
                emit("update:modelValue", year);
                emit("select", year);
              },
            },
            String(year),
          );
        }),
      );
    };
  },
});

export const dateValue = { parseDate, parseMonth, toDateValue, toMonthValue };
