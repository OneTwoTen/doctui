import { defineComponent, h, mergeProps, type PropType, ref } from "vue";
import type { Radius, Size } from "../theme/types";
import {
  composeDescribedBy,
  getFieldRootStateAttrs,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
import { InputWrapper } from "./InputWrapper";
import { radiusToken } from "./shared";

export interface TextInputProps {
  modelValue?: string;
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: Size;
  radius?: Radius;
  disabled?: boolean;
  readonly?: boolean;
  type?: string;
  placeholder?: string;
  leftSection?: string;
  rightSection?: string;
  clearable?: boolean;
}

export const TextInput = defineComponent({
  name: "DuiTextInput",
  inheritAttrs: false,
  emits: {
    "update:modelValue": (_value: string) => true,
    clear: () => true,
  },
  props: {
    modelValue: { type: String, default: "" },
    id: String,
    label: String,
    description: String,
    error: String,
    required: Boolean,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
    disabled: Boolean,
    readonly: Boolean,
    type: { type: String, default: "text" },
    placeholder: String,
    leftSection: String,
    rightSection: String,
    clearable: Boolean,
  },
  setup(props, { attrs, emit, slots }) {
    const focused = ref(false);

    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);

      return h(
        InputWrapper,
        mergeProps(
          getInputWrapperProps(props),
          rootAttrs,
          getFieldRootStateAttrs(props, "TextInput"),
        ),
        {
          default: ({
            id,
            describedBy,
          }: {
            id: string;
            describedBy?: string;
          }) => {
            const ariaDescribedBy = composeDescribedBy(
              describedBy,
              controlAttrs["aria-describedby"],
            );
            const ariaInvalid = props.error
              ? "true"
              : controlAttrs["aria-invalid"];

            return h(
              "div",
              {
                class: "dui-TextInput",
                "data-dui-component": "TextInput",
                "data-focused": focused.value ? "true" : undefined,
                "data-disabled": props.disabled ? "true" : undefined,
                "data-readonly": props.readonly ? "true" : undefined,
                "data-error": props.error ? "true" : undefined,
                "data-required": props.required ? "true" : undefined,
                "data-size": props.size,
                style: {
                  borderRadius: radiusToken(props.radius),
                },
              },
              [
                props.leftSection || slots.leftSection
                  ? h(
                      "span",
                      {
                        "data-dui-input-left-section": "",
                        class: "dui-TextInput-section dui-TextInput-leftSection",
                      },
                      props.leftSection ?? slots.leftSection?.(),
                    )
                  : null,
                h(
                  "input",
                  mergeProps(controlAttrs, {
                    id,
                    value: props.modelValue,
                    type: props.type,
                    placeholder: props.placeholder,
                    disabled: props.disabled,
                    readonly: props.readonly,
                    required: props.required,
                    "aria-invalid": ariaInvalid,
                    "aria-describedby": ariaDescribedBy,
                    class: "dui-TextInput-input",
                    onInput: (event: Event) =>
                      emit(
                        "update:modelValue",
                        (event.target as HTMLInputElement).value,
                      ),
                    onFocus: () => {
                      focused.value = true;
                    },
                    onBlur: () => {
                      focused.value = false;
                    },
                  }),
                ),
                props.rightSection || slots.rightSection
                  ? h(
                      "span",
                      {
                        "data-dui-input-right-section": "",
                        class: "dui-TextInput-section dui-TextInput-rightSection",
                      },
                      props.rightSection ?? slots.rightSection?.(),
                    )
                  : null,
                props.clearable && props.modelValue
                  ? h(
                      "button",
                      {
                        "aria-label": "Clear input",
                        class: "dui-TextInput-clear",
                        type: "button",
                        disabled: props.disabled || props.readonly,
                        onClick: () => {
                          if (props.disabled || props.readonly) return;
                          emit("update:modelValue", "");
                          emit("clear");
                        },
                      },
                      "×",
                    )
                  : null,
              ],
            );
          },
        },
      );
    };
  },
});
