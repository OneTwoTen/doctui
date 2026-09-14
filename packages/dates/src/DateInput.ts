import { defineComponent, h, type PropType, useId } from "vue";
import {
  describedBy,
  type DateValue,
  parseDate,
} from "./date-utils";

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
      h(
        "div",
        {
          class: "dui-DateInput",
          "data-disabled": props.disabled || undefined,
        },
        [
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
              "aria-label": props.label
                ? undefined
                : (props.ariaLabel ?? "Date"),
              "aria-describedby": describedBy(
                props.description ? descriptionId : undefined,
                props.error ? errorId : undefined,
              ),
              "aria-invalid": props.error ? "true" : undefined,
              onInput: (event: Event) => {
                const value = (event.target as HTMLInputElement).value;
                emit(
                  "update:modelValue",
                  value && parseDate(value) ? value : null,
                );
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
                {
                  id: errorId,
                  class: "dui-DateInput__error",
                  role: "alert",
                },
                props.error,
              )
            : null,
        ],
      );
  },
});
