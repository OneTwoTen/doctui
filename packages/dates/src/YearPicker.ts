import { defineComponent, h, nextTick, type PropType, ref, watch } from "vue";
import { chevronLeftIcon, chevronRightIcon } from "./icons";
import { listboxKeydown } from "./listbox-utils";

export const YearPicker = defineComponent({
  name: "DuiYearPicker",
  props: {
    modelValue: { type: Number as PropType<number | null>, default: null },
    minYear: { type: Number, default: () => new Date().getFullYear() - 100 },
    maxYear: { type: Number, default: () => new Date().getFullYear() + 100 },
    pageSize: { type: Number, default: 12 },
    disabled: Boolean,
    ariaLabel: { type: String, default: "Choose year" },
  },
  emits: ["update:modelValue", "select"],
  setup(props, { emit }) {
    const listbox = ref<HTMLElement | null>(null);
    const currentYear = new Date().getFullYear();

    const normalizedPageSize = () =>
      Math.max(4, Math.min(24, Math.floor(props.pageSize) || 12));
    const pageLimitStart = () =>
      Math.max(props.minYear, props.maxYear - normalizedPageSize() + 1);
    const clampPageStart = (value: number) =>
      Math.min(Math.max(value, props.minYear), pageLimitStart());
    const targetYear = () =>
      props.modelValue !== null &&
      props.modelValue >= props.minYear &&
      props.modelValue <= props.maxYear
        ? props.modelValue
        : Math.min(Math.max(currentYear, props.minYear), props.maxYear);
    const centeredStart = () =>
      clampPageStart(targetYear() - Math.floor(normalizedPageSize() / 2));

    const pageStart = ref(centeredStart());
    const activeIndex = ref(0);

    const pageYears = () => {
      const size = normalizedPageSize();
      const count = Math.max(
        0,
        Math.min(size, props.maxYear - pageStart.value + 1),
      );
      return Array.from({ length: count }, (_, index) => pageStart.value + index);
    };

    const syncActiveIndex = () => {
      const years = pageYears();
      const selectedIndex = years.indexOf(targetYear());
      activeIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
    };

    watch(
      () => [props.modelValue, props.minYear, props.maxYear, props.pageSize] as const,
      () => {
        const target = targetYear();
        const size = normalizedPageSize();
        if (
          target < pageStart.value ||
          target > pageStart.value + size - 1 ||
          pageStart.value < props.minYear ||
          pageStart.value > pageLimitStart()
        ) {
          pageStart.value = centeredStart();
        }
        syncActiveIndex();
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

    const movePage = (direction: -1 | 1) => {
      if (props.disabled) return;
      const size = normalizedPageSize();
      pageStart.value = clampPageStart(pageStart.value + direction * size);
      activeIndex.value = 0;
    };

    return () => {
      const years = pageYears();
      const firstYear = years[0] ?? props.minYear;
      const lastYear = years.at(-1) ?? props.maxYear;
      const canGoPrevious = pageStart.value > props.minYear;
      const canGoNext = lastYear < props.maxYear;

      return h(
        "div",
        {
          class: "dui-DateSurface dui-YearPicker",
          "data-disabled": props.disabled ? "true" : undefined,
        },
        [
          h("div", { class: "dui-YearPicker__header" }, [
            h(
              "button",
              {
                type: "button",
                class: "dui-Calendar__nav",
                "aria-label": "Previous years",
                disabled: props.disabled || !canGoPrevious,
                onClick: () => movePage(-1),
              },
              chevronLeftIcon(),
            ),
            h(
              "strong",
              {
                class: "dui-YearPicker__range",
                "aria-live": "polite",
              },
              `${firstYear} – ${lastYear}`,
            ),
            h(
              "button",
              {
                type: "button",
                class: "dui-Calendar__nav",
                "aria-label": "Next years",
                disabled: props.disabled || !canGoNext,
                onClick: () => movePage(1),
              },
              chevronRightIcon(),
            ),
          ]),
          h(
            "div",
            {
              ref: listbox,
              class: "dui-DatePicker__options dui-YearPicker__options",
              role: "listbox",
              "aria-label": props.ariaLabel,
              "aria-disabled": props.disabled ? "true" : undefined,
            },
            years.map((year, index) => {
              const selected = props.modelValue === year;

              return h(
                "button",
                {
                  type: "button",
                  class: "dui-DatePicker__option",
                  role: "option",
                  "aria-selected": selected ? "true" : "false",
                  "aria-current": year === currentYear ? "date" : undefined,
                  "data-selected": selected ? "true" : undefined,
                  "data-current": year === currentYear ? "true" : undefined,
                  tabindex: activeIndex.value === index ? 0 : -1,
                  disabled: props.disabled,
                  onFocus: () => (activeIndex.value = index),
                  onKeydown: (event: KeyboardEvent) =>
                    listboxKeydown(event, index, years.length, (next) => {
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
          ),
        ],
      );
    };
  },
});
