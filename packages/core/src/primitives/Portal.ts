import { defineComponent, h, type PropType, Teleport } from "vue";

export const Portal = defineComponent({
  name: "DuiPortal",
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    to: {
      type: [String, Object] as PropType<string | HTMLElement>,
      default: "body",
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        Teleport as unknown as string,
        { ...attrs, to: props.to, disabled: props.disabled },
        slots.default?.(),
      );
  },
});
