import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

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

const trapStack: HTMLElement[] = [];

export const FocusTrap = defineComponent({
  name: "DuiFocusTrap",
  inheritAttrs: false,
  props: {
    active: { type: Boolean, default: true },
    trapped: { type: Boolean, default: true },
    returnFocus: { type: Boolean, default: true },
  },
  setup(props, { attrs, slots }) {
    const root = ref<HTMLElement>();
    let restoreElement: HTMLElement | null = null;
    let lastFocusedInside: HTMLElement | null = null;
    let registered = false;
    let redirectingFocus = false;

    const getFocusable = () =>
      Array.from(
        root.value?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));

    const isTopTrap = () => root.value === trapStack.at(-1);

    const register = () => {
      if (!root.value || registered) return;
      trapStack.push(root.value);
      registered = true;
    };

    const unregister = () => {
      if (!root.value || !registered) return;
      const index = trapStack.lastIndexOf(root.value);
      if (index >= 0) trapStack.splice(index, 1);
      registered = false;
    };

    const focusInside = (preferLast = false) => {
      if (!root.value || redirectingFocus) return;
      const focusable = getFocusable();
      const target =
        preferLast &&
        lastFocusedInside?.isConnected &&
        root.value.contains(lastFocusedInside)
          ? lastFocusedInside
          : (focusable[0] ?? root.value);

      if (document.activeElement === target) return;
      redirectingFocus = true;
      target.focus({ preventScroll: true });
      redirectingFocus = false;
    };

    const activate = async () => {
      if (!props.active || typeof document === "undefined") return;
      restoreElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      register();
      await nextTick();
      if (props.active && props.trapped && isTopTrap()) focusInside();
    };

    const deactivate = () => {
      unregister();
      if (props.returnFocus && restoreElement?.isConnected) {
        restoreElement.focus({ preventScroll: true });
      }
      restoreElement = null;
      lastFocusedInside = null;
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (
        !props.active ||
        !props.trapped ||
        !isTopTrap() ||
        event.key !== "Tab"
      ) {
        return;
      }

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        root.value?.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const activeElement = document.activeElement;
      if (!root.value?.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
        return;
      }

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!props.active || !props.trapped || !isTopTrap() || !root.value) {
        return;
      }

      const target = event.target;
      if (target instanceof HTMLElement && root.value.contains(target)) {
        lastFocusedInside = target;
        return;
      }

      focusInside(true);
    };

    onMounted(() => {
      if (typeof document === "undefined") return;
      document.addEventListener("keydown", onKeydown, true);
      document.addEventListener("focusin", onFocusIn, true);
      if (props.active) void activate();
    });

    watch(
      () => props.active,
      (active, previous) => {
        if (active && !previous) void activate();
        if (!active && previous) deactivate();
      },
    );

    watch(
      () => props.trapped,
      async (trapped, previous) => {
        if (!trapped || previous || !props.active) return;
        await nextTick();
        if (
          isTopTrap() &&
          root.value &&
          !root.value.contains(document.activeElement)
        ) {
          focusInside(true);
        }
      },
    );

    onBeforeUnmount(() => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", onKeydown, true);
        document.removeEventListener("focusin", onFocusIn, true);
      }
      deactivate();
    });

    return () =>
      h(
        "div",
        {
          ...attrs,
          ref: root,
          tabindex: -1,
          "data-dui-component": "FocusTrap",
          class: ["dui-FocusTrap", attrs.class],
        },
        slots.default?.(),
      );
  },
});
