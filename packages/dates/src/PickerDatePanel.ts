import { defineComponent, h, nextTick, type PropType, ref, watch } from "vue";
import { Calendar } from "./Calendar";
import {
  type DateValue,
  parseDate,
  parseMonth,
  toMonthValue,
} from "./date-utils";
import { MonthPicker } from "./MonthPicker";
import { YearPicker } from "./YearPicker";

type PickerView = "day" | "month" | "year";

export const PickerDatePanel = defineComponent({
  name: "DuiPickerDatePanel",
  props: {
    id: { type: String, default: undefined },
    modelValue: { type: String as PropType<DateValue>, default: null },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    locale: { type: String, default: "en-US" },
    firstDayOfWeek: { type: Number, default: 0 },
    disabled: Boolean,
    ariaLabel: { type: String, default: "Choose date" },
  },
  emits: ["update:modelValue", "select", "update:view"],
  setup(props, { emit, slots }) {
    const root = ref<HTMLElement | null>(null);
    const fallbackDate = new Date();
    const initialDate = parseDate(props.modelValue) ?? fallbackDate;
    const visibleMonth = ref(toMonthValue(initialDate));
    const view = ref<PickerView>("day");

    const focusCurrentView = async () => {
      await nextTick();
      root.value
        ?.querySelector<HTMLButtonElement>(
          '[role="gridcell"][tabindex="0"], [role="option"][tabindex="0"]',
        )
        ?.focus();
    };

    const setView = (next: PickerView) => {
      view.value = next;
      emit("update:view", next);
      void focusCurrentView();
    };

    const visibleDate = () =>
      parseMonth(visibleMonth.value) ??
      parseDate(props.modelValue) ??
      fallbackDate;
    const visibleYear = () => visibleDate().getFullYear();
    const minYear = () =>
      parseDate(props.minDate)?.getFullYear() ?? visibleYear() - 100;
    const maxYear = () =>
      parseDate(props.maxDate)?.getFullYear() ?? visibleYear() + 100;

    watch(
      () => props.modelValue,
      (value) => {
        const date = parseDate(value);
        if (date) visibleMonth.value = toMonthValue(date);
      },
    );

    return () => {
      const panel =
        view.value === "day"
          ? h(Calendar, {
              modelValue: props.modelValue,
              month: visibleMonth.value,
              ...(props.minDate !== undefined
                ? { minDate: props.minDate }
                : {}),
              ...(props.maxDate !== undefined
                ? { maxDate: props.maxDate }
                : {}),
              locale: props.locale,
              firstDayOfWeek: props.firstDayOfWeek,
              disabled: props.disabled,
              ariaLabel: props.ariaLabel,
              headerInteractive: true,
              "onUpdate:month": (value: string) => {
                visibleMonth.value = value;
              },
              "onUpdate:modelValue": (value: DateValue) => {
                emit("update:modelValue", value);
              },
              onSelect: (value: DateValue) => emit("select", value),
              onTitleClick: () => setView("month"),
            })
          : view.value === "month"
            ? h(MonthPicker, {
                modelValue: visibleMonth.value,
                year: visibleYear(),
                locale: props.locale,
                disabled: props.disabled,
                headerInteractive: true,
                "onUpdate:modelValue": (value: string) => {
                  visibleMonth.value = value;
                  setView("day");
                },
                onTitleClick: () => setView("year"),
              })
            : h(YearPicker, {
                modelValue: visibleYear(),
                minYear: minYear(),
                maxYear: maxYear(),
                disabled: props.disabled,
                "onUpdate:modelValue": (year: number) => {
                  const month = visibleDate().getMonth();
                  visibleMonth.value = toMonthValue(new Date(year, month, 1));
                  setView("month");
                },
              });

      return h(
        "div",
        {
          id: props.id,
          ref: root,
          class: "dui-DatePickerPanel dui-DateSurface",
          role: "dialog",
          "aria-label": props.ariaLabel,
          "data-view": view.value,
          "data-disabled": props.disabled ? "true" : undefined,
        },
        [panel, slots.footer?.()],
      );
    };
  },
});
