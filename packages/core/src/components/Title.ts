import { defineComponent, h, type PropType } from "vue";
import type { Size } from "../theme/types";
import { fontSizeToken, lineHeightToken } from "./shared";

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

const titleSizes: Record<TitleOrder, Size> = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "sm",
  5: "sm",
  6: "xs",
};

export interface TitleProps {
  order?: TitleOrder;
}

export const Title = defineComponent({
  name: "DuiTitle",
  inheritAttrs: false,
  props: {
    order: {
      type: Number as PropType<TitleOrder>,
      default: 2,
      validator: (value: number) => Number.isInteger(value) && value >= 1 && value <= 6,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const size = titleSizes[props.order];

      return h(
        `h${props.order}`,
        {
          ...attrs,
          "data-dui-component": "Title",
          "data-order": String(props.order),
          class: ["dui-Title", attrs.class],
          style: [
            attrs.style,
            {
              color: "var(--dui-color-text)",
              fontFamily: "var(--dui-font-family)",
              fontSize: fontSizeToken(size),
              fontWeight: 700,
              lineHeight: lineHeightToken(size),
              margin: 0,
            },
          ],
        },
        slots.default?.(),
      );
    };
  },
});
