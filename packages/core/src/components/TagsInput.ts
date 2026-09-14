import {
  computed,
  defineComponent,
  h,
  mergeProps,
  nextTick,
  type PropType,
  ref,
} from "vue";
import type { Radius, Size } from "../theme/types";
import {
  composeDescribedBy,
  getFieldRootStateAttrs,
  getInputWrapperProps,
  splitFieldAttrs,
} from "./field-internals";
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
    id: String,
    name: String,
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
    const draft = ref("");
    const input = ref<HTMLInputElement>();
    const canMutate = computed(() => !props.disabled && !props.readonly);
    const maxTags = computed(() =>
      props.maxTags === undefined
        ? Number.POSITIVE_INFINITY
        : Math.max(0, props.maxTags),
    );

    const commitTags = (rawValues: readonly string[]) => {
      if (!canMutate.value) return [];

      const next = [...props.modelValue];
      const added: string[] = [];

      for (const rawValue of rawValues) {
        const value = rawValue.trim();
        if (!value || next.includes(value) || next.length >= maxTags.value) {
          continue;
        }
        next.push(value);
        added.push(value);
      }

      if (added.length > 0) {
        emit("update:modelValue", next);
        for (const value of added) emit("add", value);
      }

      return added;
    };

    const resetDraft = () => {
      draft.value = "";
      if (input.value) input.value.value = "";
    };

    const addDraft = () => {
      const added = commitTags([draft.value]);
      if (added.length > 0) resetDraft();
    };

    const focusInput = () => {
      void nextTick(() => input.value?.focus());
    };

    const remove = (value: string, restoreFocus = false) => {
      if (!canMutate.value) return;
      emit(
        "update:modelValue",
        props.modelValue.filter((item) => item !== value),
      );
      emit("remove", value);
      if (restoreFocus) focusInput();
    };

    const clear = () => {
      if (!canMutate.value || !props.modelValue.length) return;
      emit("update:modelValue", []);
      emit("clear");
      resetDraft();
      focusInput();
    };

    const onKeydown = (event: KeyboardEvent) => {
      const isSingleCharacterSeparator =
        props.separator.length === 1 && event.key === props.separator;

      if (event.key === "Enter" || isSingleCharacterSeparator) {
        event.preventDefault();
        addDraft();
      } else if (
        event.key === "Backspace" &&
        !draft.value &&
        props.modelValue.length
      ) {
        event.preventDefault();
        remove(props.modelValue[props.modelValue.length - 1] as string);
      }
    };

    const onInput = (event: Event) => {
      if (!canMutate.value) return;

      const value = (event.target as HTMLInputElement).value;
      if (props.separator && value.includes(props.separator)) {
        const values = value.split(props.separator);
        commitTags(values.slice(0, -1));
        draft.value = values.at(-1) ?? "";
      } else {
        draft.value = value;
      }
    };

    const onControlClick = (event: MouseEvent) => {
      if (props.disabled) return;

      const target = event.target as HTMLElement | null;
      if (target === input.value || target?.closest("button")) return;
      input.value?.focus();
    };

    return () => {
      const { rootAttrs, controlAttrs } = splitFieldAttrs(attrs);
      const explicitAriaLabel =
        props.ariaLabel ??
        (typeof controlAttrs["aria-label"] === "string"
          ? controlAttrs["aria-label"]
          : undefined);
      const selectedTagsLabel = `${props.label ?? explicitAriaLabel ?? "Tags"} selected tags`;
      const formAttribute =
        typeof controlAttrs.form === "string" ? controlAttrs.form : undefined;

      return h(
        InputWrapper,
        mergeProps(
          getInputWrapperProps(props),
          rootAttrs,
          getFieldRootStateAttrs(props, "TagsInput"),
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
            const ariaLabel =
              explicitAriaLabel ?? (props.label ? undefined : "Tags");

            return h(
              "div",
              {
                class: "dui-TagsInput",
                "data-dui-component": "TagsInput",
                "data-size": props.size,
                "data-disabled": props.disabled ? "true" : undefined,
                "data-readonly": props.readonly ? "true" : undefined,
                "data-error": props.error ? "true" : undefined,
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
                    onClick: onControlClick,
                  },
                  [
                    props.modelValue.length > 0
                      ? h(
                          "div",
                          {
                            class: "dui-TagsInput-tags",
                            role: "list",
                            "aria-label": selectedTagsLabel,
                          },
                          props.modelValue.map((value) =>
                            h(
                              "span",
                              {
                                class: "dui-TagsInput-tag",
                                role: "listitem",
                                key: value,
                              },
                              [
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
                                    onClick: () => remove(value, true),
                                  },
                                  "×",
                                ),
                              ],
                            ),
                          ),
                        )
                      : null,
                    h(
                      "input",
                      mergeProps(controlAttrs, {
                        ref: input,
                        id,
                        name: undefined,
                        value: draft.value,
                        disabled: props.disabled,
                        readonly: props.readonly,
                        required:
                          props.required && props.modelValue.length === 0,
                        placeholder:
                          props.modelValue.length === 0
                            ? props.placeholder
                            : undefined,
                        "aria-label": ariaLabel,
                        "aria-invalid": ariaInvalid,
                        "aria-describedby": ariaDescribedBy,
                        autocomplete: "off",
                        class: "dui-TagsInput-input",
                        onInput,
                        onKeydown,
                      }),
                    ),
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
                ...(props.name
                  ? props.modelValue.map((value, index) =>
                      h("input", {
                        key: `${index}:${value}`,
                        type: "hidden",
                        name: props.name,
                        value,
                        form: formAttribute,
                        disabled: props.disabled,
                        "data-dui-tags-input-value": "",
                      }),
                    )
                  : []),
              ],
            );
          },
        },
      );
    };
  },
});
