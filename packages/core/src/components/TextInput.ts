import { defineComponent, h, type PropType, ref, useId } from "vue";
import type { Radius, Size } from "../theme/types";
import { InputWrapper } from "./InputWrapper";
import { fontSizeToken, radiusToken } from "./shared";

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
}

export const TextInput = defineComponent({
  name: "DuiTextInput",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: string) => true },
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
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = useId();
    const id = props.id ?? `dui-input-${generatedId}`;
    const focused = ref(false);
    return () => {
      const wrapperProps = {
        id,
        ...(props.label === undefined ? {} : { label: props.label }),
        ...(props.description === undefined
          ? {}
          : { description: props.description }),
        ...(props.error === undefined ? {} : { error: props.error }),
        required: props.required,
      };
      return h(InputWrapper, wrapperProps, {
        default: ({ describedBy }: { describedBy?: string }) =>
          h(
            "div",
            {
              class: "dui-TextInput",
              "data-focused": focused.value ? "true" : undefined,
              "data-disabled": props.disabled ? "true" : undefined,
              "data-error": props.error ? "true" : undefined,
              style: {
                borderRadius: radiusToken(props.radius),
                fontSize: fontSizeToken(props.size),
              },
            },
            [
              props.leftSection || slots.leftSection
                ? h(
                    "span",
                    {
                      "data-dui-input-left-section": "",
                      class: "dui-TextInput-section",
                    },
                    props.leftSection ?? slots.leftSection?.(),
                  )
                : null,
              h("input", {
                ...attrs,
                id,
                value: props.modelValue,
                type: props.type,
                placeholder: props.placeholder,
                disabled: props.disabled,
                readonly: props.readonly,
                required: props.required,
                "aria-invalid": props.error ? "true" : undefined,
                "aria-describedby": describedBy,
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
              props.rightSection || slots.rightSection
                ? h(
                    "span",
                    {
                      "data-dui-input-right-section": "",
                      class: "dui-TextInput-section",
                    },
                    props.rightSection ?? slots.rightSection?.(),
                  )
                : null,
            ],
          ),
      });
    };
  },
});
