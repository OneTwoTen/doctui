import {
  cloneVNode,
  defineComponent,
  h,
  nextTick,
  type PropType,
  ref,
  useId,
} from "vue";
import { DismissableLayer } from "../primitives";

function resolveElement(value: unknown): HTMLElement | undefined {
  if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "$el" in value &&
    typeof HTMLElement !== "undefined" &&
    value.$el instanceof HTMLElement
  ) {
    return value.$el;
  }
  return undefined;
}

export const Popover = defineComponent({
  name: "DuiPopover",
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    position: {
      type: String as PropType<"top" | "bottom" | "left" | "right">,
      default: "bottom",
    },
    closeOnEscape: { type: Boolean, default: true },
    closeOnClickOutside: { type: Boolean, default: true },
  },
  emits: { "update:modelValue": (_value: boolean) => true },
  setup(props, { attrs, emit, slots }) {
    const panelId = `dui-popover-${useId()}`;
    const defaultTriggerId = `dui-popover-trigger-${useId()}`;
    const triggerElement = ref<HTMLElement>();

    const setOpen = (value: boolean, restoreFocus = false) => {
      emit("update:modelValue", value);
      if (!value && restoreFocus) {
        void nextTick(() => triggerElement.value?.focus());
      }
    };

    return () => {
      const targetNodes = slots.target?.() ?? [];
      const existingTriggerId = targetNodes[0]?.props?.id;
      const triggerId =
        typeof existingTriggerId === "string" && existingTriggerId.length > 0
          ? existingTriggerId
          : defaultTriggerId;
      const target = targetNodes[0]
        ? cloneVNode(
            targetNodes[0],
            {
              ref: (value: unknown) => {
                triggerElement.value = resolveElement(value);
              },
              id: triggerId,
              "aria-haspopup": "dialog",
              "aria-expanded": String(props.modelValue),
              "aria-controls": panelId,
              onClick: () => setOpen(!props.modelValue),
            },
            true,
          )
        : null;

      return h(
        "div",
        {
          ...attrs,
          "data-dui-component": "Popover",
          class: ["dui-Popover", attrs.class],
        },
        [
          h("div", { class: "dui-Popover-target" }, [
            target,
            ...targetNodes.slice(1),
          ]),
          props.modelValue
            ? h(
                DismissableLayer,
                {
                  closeOnEscape: props.closeOnEscape,
                  onEscape: () => setOpen(false, true),
                  ...(props.closeOnClickOutside
                    ? { onOutside: () => setOpen(false) }
                    : {}),
                },
                {
                  default: () =>
                    h(
                      "div",
                      {
                        id: panelId,
                        class: "dui-Popover-panel",
                        role: "dialog",
                        "aria-labelledby": triggerId,
                        "data-position": props.position,
                      },
                      slots.default?.(),
                    ),
                },
              )
            : null,
        ],
      );
    };
  },
});
