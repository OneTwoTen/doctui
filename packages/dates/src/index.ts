import "./styles.css";
import { defineComponent, h, type PropType, ref, watch } from "vue";

export type DateValue = string | null;

const pad = (value: number) => String(value).padStart(2, "0");
const parseDate = (value?: string | null) => {
  if (!value) return null;
  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (![year, month, day].every(Number.isFinite)) return null;
  return new Date(year, month - 1, day);
};
const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const toMonthValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
const parseMonth = (value?: string | null) => {
  if (!value) return null;
  const [yearText, monthText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  return Number.isFinite(year) && Number.isFinite(month)
    ? new Date(year, month - 1, 1)
    : null;
};
const monthLabel = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    date,
  );
const dayLabels = (locale: string, firstDayOfWeek: number) => {
  const base = new Date(2024, 0, 7 + firstDayOfWeek);
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + index),
    ),
  );
};
const isOutsideRange = (value: string, minDate?: string, maxDate?: string) =>
  Boolean((minDate && value < minDate) || (maxDate && value > maxDate));

export const Calendar = defineComponent({
  name: "DuiCalendar",
  props: {
    modelValue: { type: String as PropType<DateValue>, default: null },
    month: { type: String, default: undefined },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    locale: { type: String, default: "en-US" },
    firstDayOfWeek: { type: Number, default: 0 },
  },
  emits: ["update:modelValue", "update:month", "select"],
  setup(props, { emit }) {
    const initial =
      parseMonth(props.month) ??
      parseDate(props.modelValue) ??
      new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const visibleMonth = ref(initial);
    watch(
      () => props.month,
      (value) => {
        const next = parseMonth(value);
        if (next) visibleMonth.value = next;
      },
    );
    const setMonth = (offset: number) => {
      const next = new Date(
        visibleMonth.value.getFullYear(),
        visibleMonth.value.getMonth() + offset,
        1,
      );
      visibleMonth.value = next;
      emit("update:month", toMonthValue(next));
    };
    const select = (value: string) => {
      if (isOutsideRange(value, props.minDate, props.maxDate)) return;
      emit("update:modelValue", value);
      emit("select", value);
    };
    return () => {
      const year = visibleMonth.value.getFullYear();
      const month = visibleMonth.value.getMonth();
      const offset =
        (new Date(year, month, 1).getDay() - props.firstDayOfWeek + 7) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      const cells = Array.from({ length: offset + days }, (_, index) => {
        if (index < offset) return h("span", { class: "dui-Calendar__empty" });
        const day = index - offset + 1;
        const value = toDateValue(new Date(year, month, day));
        const selected = props.modelValue === value;
        const disabled = isOutsideRange(value, props.minDate, props.maxDate);
        return h(
          "button",
          {
            type: "button",
            class: "dui-Calendar__day",
            "aria-label": value,
            "aria-pressed": selected,
            disabled,
            "data-selected": selected || undefined,
            onClick: () => select(value),
          },
          String(day),
        );
      });
      return h("div", { class: "dui-Calendar", role: "group" }, [
        h("div", { class: "dui-Calendar__header" }, [
          h(
            "button",
            {
              type: "button",
              class: "dui-Calendar__nav",
              "aria-label": "Previous month",
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
              onClick: () => setMonth(1),
            },
            "›",
          ),
        ]),
        h(
          "div",
          { class: "dui-Calendar__weekdays", role: "row" },
          dayLabels(props.locale, props.firstDayOfWeek).map((label) =>
            h("span", { role: "columnheader" }, label),
          ),
        ),
        h("div", { class: "dui-Calendar__grid", role: "grid" }, cells),
      ]);
    };
  },
});

export const DateInput = defineComponent({
  name: "DuiDateInput",
  props: {
    modelValue: { type: String as PropType<DateValue>, default: null },
    label: { type: String, default: undefined },
    error: { type: String, default: undefined },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabled: Boolean,
    clearable: Boolean,
  },
  emits: ["update:modelValue", "blur", "clear"],
  setup(props, { emit }) {
    const inputId = `dui-date-${Math.random().toString(36).slice(2)}`;
    return () =>
      h("div", { class: "dui-DateInput" }, [
        props.label
          ? h(
              "label",
              { class: "dui-DateInput__label", for: inputId },
              props.label,
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
            "aria-invalid": props.error ? "true" : undefined,
            onInput: (event: Event) =>
              emit(
                "update:modelValue",
                (event.target as HTMLInputElement).value || null,
              ),
            onBlur: (event: FocusEvent) => emit("blur", event),
          }),
          props.clearable && props.modelValue
            ? h(
                "button",
                {
                  type: "button",
                  class: "dui-DateInput__clear",
                  "aria-label": "Clear date",
                  onClick: () => {
                    emit("update:modelValue", null);
                    emit("clear");
                  },
                },
                "×",
              )
            : null,
        ]),
        props.error
          ? h("div", { class: "dui-DateInput__error" }, props.error)
          : null,
      ]);
  },
});

export const DatePicker = defineComponent({
  name: "DuiDatePicker",
  props: {
    modelValue: { type: String as PropType<DateValue>, default: null },
    label: { type: String, default: undefined },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    clearable: Boolean,
  },
  emits: ["update:modelValue", "select", "blur", "clear"],
  setup(props, { emit }) {
    const opened = ref(false);
    return () => {
      const inputProps = {
        ...(props.label !== undefined ? { label: props.label } : {}),
        modelValue: props.modelValue,
        ...(props.minDate !== undefined ? { minDate: props.minDate } : {}),
        ...(props.maxDate !== undefined ? { maxDate: props.maxDate } : {}),
        clearable: props.clearable,
        "onUpdate:modelValue": (value: DateValue) =>
          emit("update:modelValue", value),
        onBlur: (event: FocusEvent) => emit("blur", event),
        onClear: () => emit("clear"),
      };
      return h("div", { class: "dui-DatePicker" }, [
        h(DateInput, inputProps),
        h(
          "button",
          {
            type: "button",
            class: "dui-DatePicker__toggle",
            "aria-label": "Open calendar",
            "aria-expanded": opened.value,
            onClick: () => (opened.value = !opened.value),
          },
          "▣",
        ),
        opened.value
          ? h(Calendar, {
              modelValue: props.modelValue,
              ...(props.minDate !== undefined
                ? { minDate: props.minDate }
                : {}),
              ...(props.maxDate !== undefined
                ? { maxDate: props.maxDate }
                : {}),
              "onUpdate:modelValue": (value: DateValue) => {
                emit("update:modelValue", value);
                emit("select", value);
                opened.value = false;
              },
            })
          : null,
      ]);
    };
  },
});

export const DateTimePicker = defineComponent({
  name: "DuiDateTimePicker",
  props: {
    modelValue: { type: String, default: "" },
    label: { type: String, default: undefined },
    disabled: Boolean,
  },
  emits: ["update:modelValue", "blur"],
  setup(props, { emit }) {
    const inputId = `dui-datetime-${Math.random().toString(36).slice(2)}`;
    return () =>
      h("div", { class: "dui-DateInput" }, [
        props.label
          ? h(
              "label",
              { class: "dui-DateInput__label", for: inputId },
              props.label,
            )
          : null,
        h("input", {
          id: inputId,
          class: "dui-DateInput__input",
          type: "datetime-local",
          value: props.modelValue,
          disabled: props.disabled,
          onInput: (event: Event) =>
            emit("update:modelValue", (event.target as HTMLInputElement).value),
          onBlur: (event: FocusEvent) => emit("blur", event),
        }),
      ]);
  },
});

const pickerButton = (label: string, selected: boolean, select: () => void) =>
  h(
    "button",
    {
      type: "button",
      class: "dui-DatePicker__option",
      "aria-pressed": selected,
      "data-selected": selected || undefined,
      onClick: select,
    },
    label,
  );

export const MonthPicker = defineComponent({
  name: "DuiMonthPicker",
  props: {
    modelValue: { type: String, default: "" },
    year: { type: Number, default: () => new Date().getFullYear() },
    locale: { type: String, default: "en-US" },
  },
  emits: ["update:modelValue", "select"],
  setup(props, { emit }) {
    return () =>
      h(
        "div",
        { class: "dui-DatePicker__options", role: "listbox" },
        Array.from({ length: 12 }, (_, index) => {
          const date = new Date(props.year, index, 1);
          const value = toMonthValue(date);
          return pickerButton(
            new Intl.DateTimeFormat(props.locale, { month: "short" }).format(
              date,
            ),
            props.modelValue === value,
            () => {
              emit("update:modelValue", value);
              emit("select", value);
            },
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
  },
  emits: ["update:modelValue", "select"],
  setup(props, { emit }) {
    return () =>
      h(
        "div",
        { class: "dui-DatePicker__options", role: "listbox" },
        Array.from(
          { length: Math.max(0, props.maxYear - props.minYear + 1) },
          (_, index) => {
            const year = props.minYear + index;
            return pickerButton(String(year), props.modelValue === year, () => {
              emit("update:modelValue", year);
              emit("select", year);
            });
          },
        ),
      );
  },
});

export const dateValue = { parseDate, toDateValue, toMonthValue };
