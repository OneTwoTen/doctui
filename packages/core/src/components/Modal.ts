import { computed, defineComponent, h, type PropType, useId } from "vue";
import { DismissableLayer, FocusTrap } from "../primitives";
import { useScrollLock } from "../primitives/useScrollLock";
import type { Radius, Size } from "../theme/types";
import { Overlay } from "./Overlay";

export const Modal = defineComponent({
  name: "DuiModal",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: boolean) => true },
  props: {
    modelValue: Boolean,
    title: String,
    ariaLabel: String,
    size: { type: String as PropType<Size>, default: "md" },
    radius: { type: String as PropType<Radius>, default: "md" },
    centered: Boolean,
    closeOnEscape: { type: Boolean, default: true },
    closeOnClickOutside: { type: Boolean, default: true },
    withCloseButton: { type: Boolean, default: true },
  },
  setup(props, { attrs, emit, slots }) {
    const titleId = `dui-modal-title-${useId()}`;
    useScrollLock(computed(() => props.modelValue));
    const close = () => emit("update:modelValue", false);
    return () => {
      if (!props.modelValue) return null;
      return h(
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
                disabled: false,
                closeOnEscape: props.closeOnEscape,
                onEscape: close,
                ...(props.closeOnClickOutside ? { onOutside: close } : {}),
              },
              {
                default: () =>
                  h(FocusTrap, null, {
                    default: () =>
                      h(
                        "section",
                        {
                          ...attrs,
                          role: "dialog",
                          "aria-modal": "true",
                          "aria-labelledby": props.title ? titleId : undefined,
                          "aria-label": props.title
                            ? undefined
                            : props.ariaLabel,
                          "data-dui-component": "Modal",
                          "data-size": props.size,
                          class: ["dui-Modal", attrs.class],
                          onClick: (event: MouseEvent) =>
                            event.stopPropagation(),
                          style: [
                            attrs.style,
                            {
                              borderRadius: `var(--dui-radius-${props.radius})`,
                            },
                          ],
                        },
                        [
                          props.title || props.withCloseButton
                            ? h("header", { class: "dui-Modal-header" }, [
                                props.title
                                  ? h(
                                      "h2",
                                      { id: titleId, class: "dui-Modal-title" },
                                      props.title,
                                    )
                                  : null,
                                props.withCloseButton
                                  ? h(
                                      "button",
                                      {
                                        "aria-label": "Close dialog",
                                        class: "dui-Modal-close",
                                        type: "button",
                                        onClick: close,
                                      },
                                      "×",
                                    )
                                  : null,
                              ])
                            : null,
                          h(
                            "div",
                            { class: "dui-Modal-body" },
                            slots.default?.(),
                          ),
                          slots.footer
                            ? h(
                                "footer",
                                { class: "dui-Modal-footer" },
                                slots.footer(),
                              )
                            : null,
                        ],
                      ),
                  }),
              },
            ),
        },
      );
    };
  },
});
