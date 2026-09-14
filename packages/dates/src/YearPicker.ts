import {
  defineComponent,
  h,
  nextTick,
  type PropType,
  ref,
  watch,
} from "vue";
import { listboxKeydown } from "./listbox-utils";

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
