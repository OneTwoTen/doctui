import { computed, defineComponent, h, useId } from "vue";

export interface InputWrapperProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
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
  },
  setup(props, { attrs, slots }) {
    const generatedId = useId();
    const inputId = computed(() => props.id ?? `dui-input-${generatedId}`);
    return () => {
      const descriptionId = `${inputId.value}-description`;
      const errorId = `${inputId.value}-error`;
      const describedBy = props.error
        ? errorId
        : props.description
          ? descriptionId
          : undefined;
      return h(
        "div",
        {
          ...attrs,
          class: ["dui-InputWrapper", attrs.class],
          "data-dui-component": "InputWrapper",
        },
        [
          props.label
            ? h(
                "label",
                { class: "dui-InputWrapper-label", for: inputId.value },
                [
                  props.label,
                  props.required
                    ? h("span", { "aria-hidden": "true" }, " *")
                    : null,
                ],
              )
            : null,
          h(
            "div",
            {
              class: "dui-InputWrapper-control",
              "data-error": props.error ? "true" : undefined,
            },
            slots.default?.({ id: inputId.value, describedBy }),
          ),
          props.description && !props.error
            ? h(
                "div",
                { id: descriptionId, class: "dui-InputWrapper-description" },
                props.description,
              )
            : null,
          props.error
            ? h(
                "div",
                { id: errorId, class: "dui-InputWrapper-error", role: "alert" },
                props.error,
              )
            : null,
        ],
      );
    };
  },
});
