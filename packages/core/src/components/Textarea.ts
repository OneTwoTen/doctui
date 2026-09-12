import { defineComponent, h, type PropType, ref, useId } from "vue";
import type { Radius, Size } from "../theme/types";
import { InputWrapper } from "./InputWrapper";
import { fontSizeToken, radiusToken } from "./shared";

export interface TextareaProps {
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
  placeholder?: string;
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export const Textarea = defineComponent({
  name: "DuiTextarea",
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
    placeholder: String,
    rows: { type: Number, default: 3 },
    resize: {
      type: String as PropType<TextareaProps["resize"]>,
      default: "vertical",
    },
  },
  setup(props, { attrs, emit }) {
    const generatedId = useId();
    const id = props.id ?? `dui-textarea-${generatedId}`;
    const focused = ref(false);
    return () =>
      h(
        InputWrapper,
        {
          id,
          ...(props.label === undefined ? {} : { label: props.label }),
          ...(props.description === undefined
            ? {}
            : { description: props.description }),
          ...(props.error === undefined ? {} : { error: props.error }),
          required: props.required,
        },
        {
          default: ({ describedBy }: { describedBy?: string }) =>
            h("textarea", {
              ...attrs,
              id,
              value: props.modelValue,
              disabled: props.disabled,
              readonly: props.readonly,
              required: props.required,
              placeholder: props.placeholder,
              rows: props.rows,
              "aria-invalid": props.error ? "true" : undefined,
              "aria-describedby": describedBy,
              "data-dui-component": "Textarea",
              "data-focused": focused.value ? "true" : undefined,
              class: ["dui-Textarea", attrs.class],
              style: [
                attrs.style,
                {
                  borderRadius: radiusToken(props.radius),
                  fontSize: fontSizeToken(props.size),
                  resize: props.resize,
                },
              ],
              onInput: (event: Event) =>
                emit(
                  "update:modelValue",
                  (event.target as HTMLTextAreaElement).value,
                ),
              onFocus: () => {
                focused.value = true;
              },
              onBlur: () => {
                focused.value = false;
              },
            }),
        },
      );
  },
});
