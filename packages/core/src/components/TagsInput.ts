import { computed, defineComponent, h, type PropType, ref, useId } from "vue";
import type { Radius, Size } from "../theme/types";
import { InputWrapper } from "./InputWrapper";
import { fontSizeToken, radiusToken } from "./shared";

export const TagsInput = defineComponent({
  name: "DuiTagsInput",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array as PropType<readonly string[]>,
      default: () => [],
    },
    label: String,
    description: String,
    error: String,
    required: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
    ariaLabel: String,
    clearable: Boolean,
    maxTags: Number,
    separator: { type: String, default: "," },
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  emits: {
    "update:modelValue": (_value: string[]) => true,
    add: (_value: string) => true,
    remove: (_value: string) => true,
    clear: () => true,
  },
  setup(props, { attrs, emit, slots }) {
    const generatedId = useId();
    const id = `dui-tags-input-${generatedId}`;
    const draft = ref("");
    const canAdd = computed(
      () =>
        !props.disabled &&
        !props.readonly &&
        (props.maxTags === undefined ||
          props.modelValue.length < props.maxTags),
    );
    const add = (raw: string) => {
      const value = raw.trim();
      if (!value || !canAdd.value || props.modelValue.includes(value)) return;
      emit("update:modelValue", [...props.modelValue, value]);
      emit("add", value);
      draft.value = "";
    };
    const remove = (value: string) => {
      if (props.disabled || props.readonly) return;
      emit(
        "update:modelValue",
        props.modelValue.filter((item) => item !== value),
      );
      emit("remove", value);
    };
    const clear = () => {
      if (props.disabled || props.readonly || !props.modelValue.length) return;
      emit("update:modelValue", []);
      emit("clear");
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === props.separator) {
        event.preventDefault();
        add(draft.value);
      } else if (
        event.key === "Backspace" &&
        !draft.value &&
        props.modelValue.length
      ) {
        remove(props.modelValue[props.modelValue.length - 1] as string);
      }
    };
    const onInput = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      if (props.separator && value.includes(props.separator)) {
        const values = value.split(props.separator);
        values.slice(0, -1).forEach(add);
        draft.value = values.at(-1) ?? "";
      } else {
        draft.value = value;
      }
    };
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
            h(
              "div",
              {
                ...attrs,
                class: ["dui-TagsInput", attrs.class],
                "data-dui-component": "TagsInput",
                "data-disabled": props.disabled ? "true" : undefined,
                "data-readonly": props.readonly ? "true" : undefined,
                style: attrs.style,
              },
              [
                h(
                  "div",
                  {
                    class: "dui-TagsInput-control",
                    style: {
                      borderRadius: radiusToken(props.radius),
                      fontSize: fontSizeToken(props.size),
                    },
                  },
                  [
                    ...props.modelValue.map((value) =>
                      h("span", { class: "dui-TagsInput-tag" }, [
                        slots.tag
                          ? slots.tag({ value })
                          : h(
                              "span",
                              { class: "dui-TagsInput-tag-label" },
                              value,
                            ),
                        h(
                          "button",
                          {
                            type: "button",
                            class: "dui-TagsInput-remove",
                            disabled: props.disabled || props.readonly,
                            "aria-label": `Remove ${value}`,
                            onClick: () => remove(value),
                          },
                          "×",
                        ),
                      ]),
                    ),
                    h("input", {
                      id,
                      value: draft.value,
                      disabled: props.disabled,
                      readonly: props.readonly,
                      required: props.required,
                      placeholder:
                        props.modelValue.length === 0
                          ? props.placeholder
                          : undefined,
                      "aria-label": props.label ? undefined : props.ariaLabel,
                      "aria-invalid": props.error ? "true" : undefined,
                      "aria-describedby": describedBy,
                      autocomplete: "off",
                      class: "dui-TagsInput-input",
                      onInput,
                      onKeydown,
                    }),
                    props.clearable && props.modelValue.length
                      ? h(
                          "button",
                          {
                            type: "button",
                            class: "dui-TagsInput-clear",
                            disabled: props.disabled || props.readonly,
                            "aria-label": "Clear tags",
                            onClick: clear,
                          },
                          "×",
                        )
                      : null,
                  ],
                ),
              ],
            ),
        },
      );
  },
});
