import { computed, defineComponent, h, type PropType, useId } from "vue";
import { DismissableLayer, FocusTrap } from "../primitives";
import { useScrollLock } from "../primitives/useScrollLock";
import type { Radius, Size } from "../theme/types";
import { Overlay, type OverlayVisualProps } from "./Overlay";

const MODAL_WIDTHS: Record<Size, string> = {
  xs: "20rem",
  sm: "26rem",
  md: "32rem",
  lg: "42rem",
  xl: "56rem",
};

export type ModalSize = Size | number | string;

function resolveModalWidth(size: ModalSize): string {
  if (typeof size === "number") return `${size}px`;
  return MODAL_WIDTHS[size as Size] ?? size;
}

export const Modal = defineComponent({
  name: "DuiModal",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: boolean) => true },
  props: {
    modelValue: Boolean,
    title: String,
    ariaLabel: String,
    size: {
      type: [String, Number] as PropType<ModalSize>,
      default: "md",
    },
    radius: { type: String as PropType<Radius>, default: "md" },
    centered: Boolean,
    closeOnEscape: { type: Boolean, default: true },
    closeOnClickOutside: { type: Boolean, default: true },
    withCloseButton: { type: Boolean, default: true },
    withOverlay: { type: Boolean, default: true },
    overlayProps: {
      type: Object as PropType<OverlayVisualProps>,
      default: () => ({}),
    },
    lockScroll: { type: Boolean, default: true },
    trapFocus: { type: Boolean, default: true },
    returnFocus: { type: Boolean, default: true },
    portalTarget: {
      type: [String, Object] as PropType<string | HTMLElement>,
      default: "body",
    },
  },
  setup(props, { attrs, emit, slots }) {
    const titleId = `dui-modal-title-${useId()}`;
    useScrollLock(computed(() => props.modelValue && props.lockScroll));
    const close = () => emit("update:modelValue", false);

    return () => {
      if (!props.modelValue) return null;

      return h(
        Overlay,
        {
          modelValue: true,
          ...(props.overlayProps.color !== undefined
            ? { color: props.overlayProps.color }
            : {}),
          ...(props.overlayProps.opacity !== undefined
            ? { opacity: props.overlayProps.opacity }
            : {}),
          withBackdrop: props.withOverlay,
          closeOnClick: false,
          portalTarget: props.portalTarget,
          "data-align": props.centered ? "center" : "start",
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
                  h(
                    FocusTrap,
                    {
                      active: props.trapFocus,
                      returnFocus: props.returnFocus,
                    },
                    {
                      default: () =>
                        h(
                          "section",
                          {
                            ...attrs,
                            role: "dialog",
                            "aria-modal": "true",
                            "aria-labelledby": props.title
                              ? titleId
                              : undefined,
                            "aria-label": props.title
                              ? undefined
                              : (props.ariaLabel ?? "Dialog"),
                            "data-dui-component": "Modal",
                            "data-centered": props.centered ? "true" : "false",
                            "data-size": String(props.size),
                            class: ["dui-Modal", attrs.class],
                            style: [
                              attrs.style,
                              {
                                "--dui-modal-width": resolveModalWidth(
                                  props.size,
                                ),
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
                                        {
                                          id: titleId,
                                          class: "dui-Modal-title",
                                        },
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
                    },
                  ),
              },
            ),
        },
      );
    };
  },
});
