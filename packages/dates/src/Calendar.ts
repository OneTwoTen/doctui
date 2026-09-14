import { defineComponent, h, nextTick, type PropType, ref, watch } from "vue";
import {
  type DateValue,
  dayLabels,
  isOutsideRange,
  monthLabel,
  parseDate,
  parseMonth,
  toDateValue,
  toMonthValue,
} from "./date-utils";

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
          next = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1,
          );
          break;
        case "ArrowLeft":
          next = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 1,
          );
          break;
        case "ArrowDown":
          next = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 7,
          );
          break;
        case "ArrowUp":
          next = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7,
          );
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
          next = new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDate(),
          );
          break;
        case "PageDown":
          next = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
          );
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
