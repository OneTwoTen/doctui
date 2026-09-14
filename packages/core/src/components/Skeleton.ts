import { defineComponent, h, type PropType } from "vue";
import type { Radius } from "../theme/types";
import { radiusToken } from "./shared";

export interface SkeletonProps {
  visible?: boolean;
  height?: string | number;
  width?: string | number;
  radius?: Radius;
}

export const Skeleton = defineComponent({
  name: "DuiSkeleton",
  inheritAttrs: false,
  props: {
    visible: { type: Boolean, default: true },
    height: [String, Number] as PropType<string | number>,
    width: [String, Number] as PropType<string | number>,
    radius: { type: String as PropType<Radius>, default: "md" },
  },
  setup(props, { attrs, slots }) {
    return () => {
      if (!props.visible) return slots.default?.();
      return h("span", {
        ...attrs,
        "aria-busy": "true",
        "aria-hidden": "true",
        "data-dui-component": "Skeleton",
        class: ["dui-Skeleton", attrs.class],
        style: [
          attrs.style,
          {
            borderRadius: radiusToken(props.radius),
            height:
              typeof props.height === "number"
                ? `${props.height}px`
                : props.height,
            width:
              typeof props.width === "number"
                ? `${props.width}px`
                : props.width,
          },
        ],
      });
    };
  },
});
