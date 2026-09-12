import {
  computed,
  defineComponent,
  h,
  mergeProps,
  type PropType,
  useId,
} from "vue";
import type { FieldClassNames, FieldStyles } from "./field-types";

export interface InputWrapperProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  classNames?: FieldClassNames;
  styles?: FieldStyles;
}

export const InputWrapper = defineComponent({
  name: "DuiInputWrapper",
  inheritAttrs: false,
  props: {
    id: String,
    label: String,
    description: String,
    error: String,
    required: Boolean,
    classNames: Object as PropType<FieldClassNames>,
    styles: Object as PropType<FieldStyles>,
  },
  setup(props, { attrs, slots }) {
    const generatedId = useId();
    const inputId = computed(() => props.id ?? `dui-input-${generatedId}`);

    return () => {
      const descriptionId = props.description
        ? `${inputId.value}-description`
        : undefined;
      const errorId = props.error ? `${inputId.value}-error` : undefined;
      const describedBy =
        [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

      return h(
        "div",
        mergeProps(
          {
            class: ["dui-InputWrapper", props.classNames?.root],
            style: props.styles?.root,
          },
          attrs,
          {
            "data-dui-component": "InputWrapper",
            "data-required": props.required ? "true" : undefined,
            "data-error": props.error ? "true" : undefined,
          },
        ),
        [
          props.label
            ? h(
                "label",
                {
                  class: ["dui-InputWrapper-label", props.classNames?.label],
                  style: props.styles?.label,
                  for: inputId.value,
                },
                [
                  props.label,
                  props.required
                    ? h(
                        "span",
                        {
                          class: [
                            "dui-InputWrapper-required",
                            props.classNames?.required,
                          ],
                          style: props.styles?.required,
                          "aria-hidden": "true",
                        },
                        " *",
                      )
                    : null,
                ],
              )
            : null,
          h(
            "div",
            {
              class: ["dui-InputWrapper-control", props.classNames?.control],
              style: props.styles?.control,
              "data-error": props.error ? "true" : undefined,
            },
            slots.default?.({ id: inputId.value, describedBy }),
          ),
          props.description
            ? h(
                "div",
                {
                  id: descriptionId,
                  class: [
                    "dui-InputWrapper-description",
                    props.classNames?.description,
                  ],
                  style: props.styles?.description,
                },
                props.description,
              )
            : null,
          props.error
            ? h(
                "div",
                {
                  id: errorId,
                  class: ["dui-InputWrapper-error", props.classNames?.error],
                  style: props.styles?.error,
                  role: "alert",
                },
                props.error,
              )
            : null,
        ],
      );
    };
  },
});
