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
    const focusOption = (
      start: number,
      direction: 1 | -1,
      container: HTMLElement,
    ) => {
      let index = start;
      for (let count = 0; count < props.data.length; count += 1) {
        index = (index + direction + props.data.length) % props.data.length;
        if (!props.data[index]?.disabled && !props.disabled) {
          container
            .querySelectorAll<HTMLElement>(".dui-SegmentedControl-option")
            [index]?.focus();
          return;
        }
      }
    };
    const select = (option: SegmentOption) => {
      if (!props.disabled && !option.disabled)
        emit("update:modelValue", option.value);
    };
    return () =>
      h(
        "div",
        {
          ...attrs,
          role: "radiogroup",
          "aria-label": props.ariaLabel,
          "data-disabled": props.disabled ? "true" : undefined,
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
              tabindex: props.modelValue === option.value ? 0 : -1,
              "data-active":
                props.modelValue === option.value ? "true" : undefined,
              class: "dui-SegmentedControl-option",
              onClick: () => select(option),
              onKeydown: async (event: KeyboardEvent) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  focusOption(
                    index,
                    1,
                    (event.currentTarget as HTMLElement)
                      .parentElement as HTMLElement,
                  );
                } else if (
                  event.key === "ArrowLeft" ||
                  event.key === "ArrowUp"
                ) {
                  event.preventDefault();
                  focusOption(
                    index,
                    -1,
                    (event.currentTarget as HTMLElement)
                      .parentElement as HTMLElement,
                  );
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  const target =
                    event.key === "Home" ? 0 : props.data.length - 1;
                  (event.currentTarget as HTMLElement).parentElement
                    ?.querySelectorAll<HTMLElement>(
                      ".dui-SegmentedControl-option",
                    )
                    [target]?.focus();
                } else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  select(option);
                }
                await nextTick();
              },
            },
            option.label,
          ),
        ),
      );
  },
});
