import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";

const layerStack: HTMLElement[] = [];

export const DismissableLayer = defineComponent({
  name: "DuiDismissableLayer",
  inheritAttrs: false,
  emits: {
    outside: (_event: PointerEvent) => true,
    escape: (_event: KeyboardEvent) => true,
  },
  props: { disabled: Boolean, closeOnEscape: { type: Boolean, default: true } },
  setup(props, { attrs, emit, slots }) {
    const root = ref<HTMLElement>();
    const isTopLayer = () => root.value === layerStack.at(-1);
    const getBoundary = () =>
      root.value?.querySelector<HTMLElement>(
        "[data-dui-dismissable-boundary]",
      ) ?? root.value;
    const onPointerDown = (event: PointerEvent) => {
      const boundary = getBoundary();
      if (
        !props.disabled &&
        isTopLayer() &&
        boundary &&
        !boundary.contains(event.target as Node)
      ) {
        emit("outside", event);
      }
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (
        !props.disabled &&
        props.closeOnEscape &&
        isTopLayer() &&
        event.key === "Escape"
      ) {
        event.stopPropagation();
        emit("escape", event);
      }
    };
    onMounted(() => {
      if (root.value) layerStack.push(root.value);
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKeydown);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeydown);
      if (root.value) {
        const index = layerStack.indexOf(root.value);
        if (index >= 0) layerStack.splice(index, 1);
      }
    });
    return () =>
      h(
        "div",
        {
          ...attrs,
          ref: root,
          class: ["dui-DismissableLayer", attrs.class],
        },
        slots.default?.(),
      );
  },
});
