import { defineComponent, h, nextTick, ref, watch } from "vue";
import { parseMonth, toMonthValue } from "./date-utils";
import { listboxKeydown } from "./listbox-utils";

export const MonthPicker = defineComponent({
  name: "DuiMonthPicker",
  props: {
    modelValue: { type: String, default: "" },
    year: { type: Number, default: () => new Date().getFullYear() },
    locale: { type: String, default: "en-US" },
    disabled: Boolean,
    ariaLabel: { type: String, default: "Choose month" },
    headerInteractive: Boolean,
  },
  emits: ["update:modelValue", "select", "titleClick"],
  setup(props, { emit }) {
    const listbox = ref<HTMLElement | null>(null);
    const selectedMonth = () => {
      const parsed = parseMonth(props.modelValue);
      return parsed && parsed.getFullYear() === props.year
        ? parsed.getMonth()
        : 0;
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
      listbox.value
        ?.querySelectorAll<HTMLButtonElement>('[role="option"]')
        .item(index)
        ?.focus();
    };

    return () =>
      h(
        "div",
        {
          class: "dui-DateSurface dui-MonthPicker",
          "data-disabled": props.disabled ? "true" : undefined,
        },
        [
          h("div", { class: "dui-DateSurface__header" }, [
            props.headerInteractive
              ? h(
                  "button",
                  {
                    type: "button",
                    class: "dui-DateSurface__titleButton",
                    "aria-label": `Choose year, current ${props.year}`,
                    disabled: props.disabled,
                    onClick: () => emit("titleClick"),
                  },
                  String(props.year),
                )
              : h(
                  "strong",
                  { class: "dui-DateSurface__title" },
                  String(props.year),
                ),
          ]),
          h(
            "div",
            {
              ref: listbox,
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
                  "data-selected": selected ? "true" : undefined,
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
                new Intl.DateTimeFormat(props.locale, {
                  month: "short",
                }).format(date),
              );
            }),
          ),
        ],
      );
  },
});
