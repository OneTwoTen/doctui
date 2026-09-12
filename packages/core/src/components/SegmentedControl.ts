import { defineComponent, h, nextTick, type PropType } from "vue";
import type { Radius, Size } from "../theme/types";
import { radiusToken, spacingToken } from "./shared";

export interface SegmentOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  modelValue?: string | number;
  data: readonly SegmentOption[];
  ariaLabel?: string;
  size?: Size;
  radius?: Radius;
  disabled?: boolean;
}

export const SegmentedControl = defineComponent({
  name: "DuiSegmentedControl",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: string | number) => true },
  props: {
    modelValue: [String, Number] as PropType<string | number>,
    data: { type: Array as PropType<readonly SegmentOption[]>, required: true },
    ariaLabel: String,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
    disabled: Boolean,
  },
  setup(props, { attrs, emit }) {
    const isEnabled = (index: number) =>
      !props.disabled && Boolean(props.data[index] && !props.data[index]?.disabled);

    const firstEnabledIndex = () =>
      props.data.findIndex((_option, index) => isEnabled(index));

    const lastEnabledIndex = () => {
      for (let index = props.data.length - 1; index >= 0; index -= 1) {
        if (isEnabled(index)) return index;
      }
      return -1;
    };

    const selectedEnabledIndex = () =>
      props.data.findIndex(
        (option, index) =>
          isEnabled(index) && props.modelValue === option.value,
      );

    const tabStopIndex = () => {
      const selected = selectedEnabledIndex();
      return selected >= 0 ? selected : firstEnabledIndex();
    };

    const nextEnabledIndex = (start: number, direction: 1 | -1) => {
      if (props.data.length === 0 || props.disabled) return -1;

      let index = start;
      for (let count = 0; count < props.data.length; count += 1) {
        index = (index + direction + props.data.length) % props.data.length;
        if (isEnabled(index)) return index;
      }

      return -1;
    };

    const optionElements = (container: HTMLElement) =>
      container.querySelectorAll<HTMLElement>(".dui-SegmentedControl-option");

    const focusIndex = (index: number, container: HTMLElement) => {
      optionElements(container)[index]?.focus();
    };

    const select = (option: SegmentOption) => {
      if (!props.disabled && !option.disabled)
        emit("update:modelValue", option.value);
    };

    const activateIndex = async (index: number, container: HTMLElement) => {
      const option = props.data[index];
      if (!option || !isEnabled(index)) return;

      select(option);
      await nextTick();
      focusIndex(index, container);
    };

    return () => {
      const activeTabStop = tabStopIndex();

      return h(
        "div",
        {
          ...attrs,
          role: "radiogroup",
          "aria-label": props.ariaLabel,
          "aria-disabled": props.disabled ? "true" : undefined,
          "data-disabled": props.disabled ? "true" : undefined,
          "data-size": props.size,
          "data-dui-component": "SegmentedControl",
          class: ["dui-SegmentedControl", attrs.class],
          style: [
            attrs.style,
            {
              borderRadius: radiusToken(props.radius),
              gap: spacingToken("xs"),
            },
          ],
        },
        props.data.map((option, index) =>
          h(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": String(props.modelValue === option.value),
              "aria-disabled":
                option.disabled || props.disabled ? "true" : undefined,
              disabled: option.disabled || props.disabled,
              tabindex: index === activeTabStop ? 0 : -1,
              "data-active":
                props.modelValue === option.value ? "true" : undefined,
              class: "dui-SegmentedControl-option",
              onClick: () => select(option),
              onKeydown: async (event: KeyboardEvent) => {
                const container = (event.currentTarget as HTMLElement)
                  .parentElement as HTMLElement;

                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  await activateIndex(nextEnabledIndex(index, 1), container);
                } else if (
                  event.key === "ArrowLeft" ||
                  event.key === "ArrowUp"
                ) {
                  event.preventDefault();
                  await activateIndex(nextEnabledIndex(index, -1), container);
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  const target =
                    event.key === "Home"
                      ? firstEnabledIndex()
                      : lastEnabledIndex();
                  await activateIndex(target, container);
                } else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  select(option);
                }
              },
            },
            option.label,
          ),
        ),
      );
    };
  },
});
