import { computed, defineComponent, h, type PropType, ref, useId } from "vue";
import { DismissableLayer, FocusTrap, Portal } from "../primitives";
import { useScrollLock } from "../primitives/useScrollLock";
import type { Radius, Size } from "../theme/types";
import { Overlay } from "./Overlay";

export const Drawer = defineComponent({
  name: "DuiDrawer",
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    title: String,
    ariaLabel: String,
    position: { type: String as PropType<"left" | "right">, default: "right" },
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
    closeOnEscape: { type: Boolean, default: true },
    closeOnClickOutside: { type: Boolean, default: true },
    withCloseButton: { type: Boolean, default: true },
  },
  emits: { "update:modelValue": (_value: boolean) => true },
  setup(props, { attrs, emit, slots }) {
    const titleId = `dui-drawer-title-${useId()}`;
    useScrollLock(computed(() => props.modelValue));
    const close = () => emit("update:modelValue", false);
    return () => {
      if (!props.modelValue) return null;
      return h(Portal, null, {
        default: () =>
          h(
            Overlay,
            {
              modelValue: true,
              closeOnClick: props.closeOnClickOutside,
              "onUpdate:modelValue": close,
            },
            {
              default: () =>
                h(
                  DismissableLayer,
                  {
                    closeOnEscape: props.closeOnEscape,
                    onEscape: close,
                    ...(props.closeOnClickOutside ? { onOutside: close } : {}),
                  },
                  {
                    default: () =>
                      h(FocusTrap, null, {
                        default: () =>
                          h(
                            "aside",
                            {
                              ...attrs,
                              role: "dialog",
                              "aria-modal": "true",
                              "aria-labelledby": props.title
                                ? titleId
                                : undefined,
                              "aria-label": props.title
                                ? undefined
                                : (props.ariaLabel ?? "Drawer"),
                              "data-dui-component": "Drawer",
                              class: ["dui-Drawer", attrs.class],
                              "data-position": props.position,
                              "data-size": props.size,
                              style: [
                                attrs.style,
                                {
                                  borderRadius: `var(--dui-radius-${props.radius})`,
                                },
                              ],
                              onClick: (event: MouseEvent) =>
                                event.stopPropagation(),
                            },
                            [
                              props.title || props.withCloseButton
                                ? h("header", { class: "dui-Drawer-header" }, [
                                    props.title
                                      ? h("h2", { id: titleId }, props.title)
                                      : null,
                                    props.withCloseButton
                                      ? h(
                                          "button",
                                          {
                                            type: "button",
                                            "aria-label": "Close drawer",
                                            class: "dui-Drawer-close",
                                            onClick: close,
                                          },
                                          "×",
                                        )
                                      : null,
                                  ])
                                : null,
                              h(
                                "div",
                                { class: "dui-Drawer-body" },
                                slots.default?.(),
                              ),
                            ],
                          ),
                      }),
                  },
                ),
            },
          ),
      });
    };
  },
});

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
    const close = () => emit("update:modelValue", false);
    return () =>
      h("div", { ...attrs, class: ["dui-Popover", attrs.class] }, [
        h(
          "div",
          {
            class: "dui-Popover-target",
            onClick: () => emit("update:modelValue", !props.modelValue),
          },
          slots.target?.(),
        ),
        props.modelValue
          ? h(
              DismissableLayer,
              {
                closeOnEscape: props.closeOnEscape,
                ...(props.closeOnClickOutside ? { onOutside: close } : {}),
              },
              {
                default: () =>
                  h(
                    "div",
                    {
                      class: "dui-Popover-panel",
                      role: "dialog",
                      "data-position": props.position,
                    },
                    slots.default?.(),
                  ),
              },
            )
          : null,
      ]);
  },
});

export const Tooltip = defineComponent({
  name: "DuiTooltip",
  props: {
    label: { type: String, required: true },
    modelValue: { type: Boolean, default: undefined },
    position: {
      type: String as PropType<"top" | "bottom" | "left" | "right">,
      default: "top",
    },
  },
  emits: { "update:modelValue": (_value: boolean) => true },
  setup(props, { emit, slots }) {
    const internalOpen = ref(false);
    const tooltipId = `dui-tooltip-${useId()}`;
    const open = (value: boolean) => {
      internalOpen.value = value;
      emit("update:modelValue", value);
    };
    return () => {
      const visible = props.modelValue ?? internalOpen.value;
      return h(
        "span",
        {
          class: "dui-Tooltip",
          "aria-describedby": visible ? tooltipId : undefined,
          onMouseenter: () => open(true),
          onMouseleave: () => open(false),
          onFocusin: () => open(true),
          onFocusout: () => open(false),
        },
        [
          slots.default?.(),
          visible
            ? h(
                "span",
                {
                  id: tooltipId,
                  class: "dui-Tooltip-content",
                  role: "tooltip",
                  "data-position": props.position,
                },
                props.label,
              )
            : null,
        ],
      );
    };
  },
});

export interface MenuItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export const Menu = defineComponent({
  name: "DuiMenu",
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    data: { type: Array as PropType<readonly MenuItem[]>, default: () => [] },
    closeOnClickOutside: { type: Boolean, default: true },
  },
  emits: {
    "update:modelValue": (_value: boolean) => true,
    select: (_value: string) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const activeIndex = ref(-1);
    const close = () => emit("update:modelValue", false);
    const move = (direction: 1 | -1) => {
      let index = activeIndex.value;
      for (let count = 0; count < props.data.length; count += 1) {
        index = (index + direction + props.data.length) % props.data.length;
        if (!props.data[index]?.disabled) {
          activeIndex.value = index;
          return;
        }
      }
    };
    return () =>
      h("div", { ...attrs, class: ["dui-Menu", attrs.class] }, [
        h(
          "div",
          {
            class: "dui-Menu-target",
            onClick: () => emit("update:modelValue", !props.modelValue),
          },
          slots.target?.(),
        ),
        props.modelValue
          ? h(
              DismissableLayer,
              {
                ...(props.closeOnClickOutside ? { onOutside: close } : {}),
              },
              {
                default: () =>
                  h(
                    "div",
                    {
                      class: "dui-Menu-dropdown",
                      role: "menu",
                      tabindex: -1,
                      onKeydown: (event: KeyboardEvent) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          move(1);
                        } else if (event.key === "ArrowUp") {
                          event.preventDefault();
                          move(-1);
                        } else if (event.key === "Home") {
                          event.preventDefault();
                          activeIndex.value = 0;
                        } else if (event.key === "End") {
                          event.preventDefault();
                          activeIndex.value = props.data.length - 1;
                        } else if (event.key === "Escape") {
                          close();
                        }
                      },
                    },
                    props.data.map((item, index) =>
                      h(
                        "button",
                        {
                          type: "button",
                          role: "menuitem",
                          class: "dui-Menu-item",
                          disabled: item.disabled,
                          "data-active":
                            activeIndex.value === index || undefined,
                          onClick: () => {
                            if (!item.disabled) {
                              emit("select", item.value);
                              close();
                            }
                          },
                        },
                        item.label,
                      ),
                    ),
                  ),
              },
            )
          : null,
      ]);
  },
});
