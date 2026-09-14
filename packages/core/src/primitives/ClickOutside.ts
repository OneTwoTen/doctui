import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";

export const ClickOutside = defineComponent({
  name: "DuiClickOutside",
  inheritAttrs: false,
  emits: { outside: (_event: PointerEvent) => true },
  props: { disabled: Boolean },
  setup(props, { attrs, emit, slots }) {
    const root = ref<HTMLElement>();
    const onPointerDown = (event: PointerEvent) => {
      if (
        !props.disabled &&
        root.value &&
        !root.value.contains(event.target as Node)
      ) {
        emit("outside", event);
      }
    };
    onMounted(() => document.addEventListener("pointerdown", onPointerDown));
    onBeforeUnmount(() =>
      document.removeEventListener("pointerdown", onPointerDown),
    );
    return () =>
      h(
        "div",
        {
          ...attrs,
          ref: root,
          "data-dui-component": "ClickOutside",
          class: ["dui-ClickOutside", attrs.class],
        },
        slots.default?.(),
      );
  },
});
