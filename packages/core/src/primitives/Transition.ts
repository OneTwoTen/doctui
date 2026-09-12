import {
  defineComponent,
  h,
  type PropType,
  Transition as VueTransition,
} from "vue";

export const Transition = defineComponent({
  name: "DuiTransition",
  inheritAttrs: false,
  props: {
    name: { type: String, default: "dui-fade" },
    mode: String as PropType<"in-out" | "out-in" | "default">,
    appear: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        VueTransition,
        {
          ...attrs,
          name: props.name,
          ...(props.mode && props.mode !== "default"
            ? { mode: props.mode }
            : {}),
          appear: props.appear,
        },
        slots,
      );
  },
});
