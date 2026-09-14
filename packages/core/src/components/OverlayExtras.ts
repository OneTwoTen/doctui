import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  nextTick,
  type PropType,
  ref,
  useId,
  watch,
} from "vue";
import { DismissableLayer, FocusTrap, Portal } from "../primitives";
import { useScrollLock } from "../primitives/useScrollLock";
import type { Radius, Size } from "../theme/types";
import { Overlay } from "./Overlay";

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
    const panelId = `dui-popover-${useId()}`;
    const triggerElement = ref<HTMLElement>();
    const close = (restoreFocus = false) => {
      emit("update:modelValue", false);
      if (restoreFocus) {
        void nextTick(() => triggerElement.value?.focus());
      }
    };

    return () => {
      const targetNodes = slots.target?.() ?? [];
      const target = targetNodes[0]
        ? cloneVNode(
            targetNodes[0],
            {
              ref: (value: unknown) => {
                triggerElement.value = resolveElement(value);
              },
              "aria-haspopup": "dialog",
              "aria-expanded": String(props.modelValue),
              "aria-controls": panelId,
              onClick: () => emit("update:modelValue", !props.modelValue),
            },
            true,
          )
        : null;

      return h("div", { ...attrs, class: ["dui-Popover", attrs.class] }, [
        h("div", { class: "dui-Popover-target" }, [
          target,
          ...targetNodes.slice(1),
        ]),
        props.modelValue
          ? h(
              DismissableLayer,
              {
                closeOnEscape: props.closeOnEscape,
                onEscape: () => close(true),
                ...(props.closeOnClickOutside
                  ? { onOutside: () => close(false) }
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
                      "data-position": props.position,
                    },
                    slots.default?.(),
                  ),
              },
            )
          : null,
      ]);
    };
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
      const targetNodes = slots.default?.() ?? [];
      const targetNode = targetNodes[0];
      const existingDescription = targetNode?.props?.["aria-describedby"];
      const describedBy = visible
        ? [
            typeof existingDescription === "string"
              ? existingDescription
              : undefined,
            tooltipId,
          ]
            .filter(Boolean)
            .join(" ")
        : existingDescription;
      const target = targetNode
        ? cloneVNode(
            targetNode,
            {
              "aria-describedby": describedBy,
              onMouseenter: () => open(true),
              onMouseleave: () => open(false),
              onFocusin: () => open(true),
              onFocusout: (event: FocusEvent) => {
                const currentTarget = event.currentTarget;
                const nextTarget = event.relatedTarget;
                if (
                  currentTarget instanceof HTMLElement &&
                  nextTarget instanceof Node &&
                  currentTarget.contains(nextTarget)
                ) {
                  return;
                }
                open(false);
              },
            },
            true,
          )
        : null;

      return h("span", { class: "dui-Tooltip" }, [
        target,
        ...targetNodes.slice(1),
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
      ]);
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
    const menuId = `dui-menu-${useId()}`;
    const triggerElement = ref<HTMLElement>();
    const itemElements = ref<(HTMLButtonElement | undefined)[]>([]);
    const activeIndex = ref(-1);
    const pendingFocus = ref<"first" | "last">("first");

    const firstEnabledIndex = () =>
      props.data.findIndex((item) => !item.disabled);
    const lastEnabledIndex = () => {
      for (let index = props.data.length - 1; index >= 0; index -= 1) {
        if (!props.data[index]?.disabled) return index;
      }
      return -1;
    };
    const focusIndex = (index: number) => {
      if (index < 0 || props.data[index]?.disabled) return;
      activeIndex.value = index;
      itemElements.value[index]?.focus();
    };
    const close = (restoreFocus = false) => {
      emit("update:modelValue", false);
      if (restoreFocus) {
        void nextTick(() => triggerElement.value?.focus());
      }
    };
    const move = (direction: 1 | -1) => {
      if (props.data.length === 0) return;
      let index = activeIndex.value;
      for (let count = 0; count < props.data.length; count += 1) {
        index = (index + direction + props.data.length) % props.data.length;
        if (!props.data[index]?.disabled) {
          focusIndex(index);
          return;
        }
      }
    };
    const activate = (index: number) => {
      const item = props.data[index];
      if (!item || item.disabled) return;
      emit("select", item.value);
      close(true);
    };
    const openFromTrigger = (focus: "first" | "last") => {
      pendingFocus.value = focus;
      if (props.modelValue) {
        focusIndex(focus === "first" ? firstEnabledIndex() : lastEnabledIndex());
        return;
      }
      emit("update:modelValue", true);
    };

    watch(
      () => props.modelValue,
      async (open) => {
        if (!open) return;
        const index =
          pendingFocus.value === "last"
            ? lastEnabledIndex()
            : firstEnabledIndex();
        activeIndex.value = index;
        await nextTick();
        itemElements.value[index]?.focus();
      },
      { immediate: true, flush: "post" },
    );

    watch(
      () => props.data.map((item) => `${item.value}:${item.disabled ?? false}`),
      () => {
        const current = props.data[activeIndex.value];
        if (!current || current.disabled) {
          activeIndex.value = firstEnabledIndex();
        }
      },
    );

    return () => {
      const targetNodes = slots.target?.() ?? [];
      const target = targetNodes[0]
        ? cloneVNode(
            targetNodes[0],
            {
              ref: (value: unknown) => {
                triggerElement.value = resolveElement(value);
              },
              "aria-haspopup": "menu",
              "aria-expanded": String(props.modelValue),
              "aria-controls": menuId,
              onClick: () => {
                if (props.modelValue) {
                  close(false);
                } else {
                  openFromTrigger("first");
                }
              },
              onKeydown: (event: KeyboardEvent) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  openFromTrigger("first");
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  openFromTrigger("last");
                } else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openFromTrigger("first");
                }
              },
            },
            true,
          )
        : null;
      const tabbableIndex =
        activeIndex.value >= 0 ? activeIndex.value : firstEnabledIndex();

      return h("div", { ...attrs, class: ["dui-Menu", attrs.class] }, [
        h("div", { class: "dui-Menu-target" }, [
          target,
          ...targetNodes.slice(1),
        ]),
        props.modelValue
          ? h(
              DismissableLayer,
              {
                onEscape: () => close(true),
                ...(props.closeOnClickOutside
                  ? { onOutside: () => close(false) }
                  : {}),
              },
              {
                default: () =>
                  h(
                    "div",
                    {
                      id: menuId,
                      class: "dui-Menu-dropdown",
                      role: "menu",
                      onKeydown: (event: KeyboardEvent) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          move(1);
                        } else if (event.key === "ArrowUp") {
                          event.preventDefault();
                          move(-1);
                        } else if (event.key === "Home") {
                          event.preventDefault();
                          focusIndex(firstEnabledIndex());
                        } else if (event.key === "End") {
                          event.preventDefault();
                          focusIndex(lastEnabledIndex());
                        } else if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          activate(activeIndex.value);
                        } else if (event.key === "Escape") {
                          event.preventDefault();
                          event.stopPropagation();
                          close(true);
                        }
                      },
                    },
                    props.data.map((item, index) =>
                      h(
                        "button",
                        {
                          ref: (value: unknown) => {
                            itemElements.value[index] = resolveElement(value) as
                              | HTMLButtonElement
                              | undefined;
                          },
                          type: "button",
                          role: "menuitem",
                          tabindex:
                            !item.disabled && tabbableIndex === index ? 0 : -1,
                          class: "dui-Menu-item",
                          disabled: item.disabled,
                          "data-active":
                            activeIndex.value === index || undefined,
                          onFocus: () => {
                            if (!item.disabled) activeIndex.value = index;
                          },
                          onMouseenter: () => {
                            if (!item.disabled) activeIndex.value = index;
                          },
                          onClick: () => activate(index),
                        },
                        item.label,
                      ),
                    ),
                  ),
              },
            )
          : null,
      ]);
    };
  },
});
