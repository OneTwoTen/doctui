import { defineComponent, h, nextTick, onBeforeUnmount, ref, watch } from "vue";

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable=true]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const FocusTrap = defineComponent({
  name: "DuiFocusTrap",
  inheritAttrs: false,
  props: { active: { type: Boolean, default: true } },
  setup(props, { attrs, slots }) {
    const root = ref<HTMLElement>();
    let restoreElement: HTMLElement | null = null;
    const getFocusable = () =>
      Array.from(
        root.value?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
    const activate = async () => {
      if (!props.active || typeof document === "undefined") return;
      restoreElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      await nextTick();
      const focusable = getFocusable();
      (focusable[0] ?? root.value)?.focus();
    };
    const deactivate = () => {
      if (restoreElement?.isConnected) restoreElement.focus();
      restoreElement = null;
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (!props.active || event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        root.value?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    watch(
      () => props.active,
      (active, previous) => {
        if (active && !previous) void activate();
        if (!active && previous) deactivate();
      },
      { immediate: true },
    );
    onBeforeUnmount(deactivate);
    return () =>
      h(
        "div",
        {
          ...attrs,
          ref: root,
          tabindex: -1,
          "data-dui-component": "FocusTrap",
          class: ["dui-FocusTrap", attrs.class],
          onKeydown,
        },
        slots.default?.(),
      );
  },
});
