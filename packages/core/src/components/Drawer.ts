import { computed, defineComponent, h, type PropType, useId } from "vue";
import { DismissableLayer, FocusTrap } from "../primitives";
import { useScrollLock } from "../primitives/useScrollLock";
import type { Radius, Size } from "../theme/types";
import { Overlay, type OverlayVisualProps } from "./Overlay";

const DRAWER_WIDTHS: Record<Size, string> = {
  xs: "16rem",
  sm: "20rem",
  md: "28rem",
  lg: "36rem",
  xl: "48rem",
};

export type DrawerSize = Size | number | string;
export type DrawerPosition = "left" | "right";

function resolveDrawerWidth(size: DrawerSize): string {
  if (typeof size === "number") return `${size}px`;
  return DRAWER_WIDTHS[size as Size] ?? size;
}

export const Drawer = defineComponent({
  name: "DuiDrawer",
  inheritAttrs: false,
  emits: { "update:modelValue": (_value: boolean) => true },
  props: {
    modelValue: Boolean,
    title: String,
    ariaLabel: String,
    position: {
      type: String as PropType<DrawerPosition>,
      default: "right",
    },
    size: {
      type: [String, Number] as PropType<DrawerSize>,
      default: "md",
    },
    radius: { type: String as PropType<Radius>, default: "md" },
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
    const titleId = `dui-drawer-title-${useId()}`;
    useScrollLock(computed(() => props.modelValue && props.lockScroll));
    const close = () => emit("update:modelValue", false);

    return () => {
      if (!props.modelValue) return null;

      return h(
        Overlay,
        {
          modelValue: true,
          color: props.overlayProps.color,
          opacity: props.overlayProps.opacity,
          withBackdrop: props.withOverlay,
          closeOnClick: false,
          portalTarget: props.portalTarget,
        },
        {
          default: () =>
            h(
              DismissableLayer,
              {
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
                          "aside",
                          {
                            ...attrs,
                            role: "dialog",
                            "aria-modal": "true",
                            "aria-labelledby": props.title
                              ? titleId
                              : undefined,
                            "aria-label": props.title
                              ? undefined
                              : (props.ariaLabel ?? "Drawer"),
                            "data-dui-component": "Drawer",
                            class: ["dui-Drawer", attrs.class],
                            "data-position": props.position,
                            "data-size": String(props.size),
                            style: [
                              attrs.style,
                              {
                                "--dui-drawer-width": resolveDrawerWidth(
                                  props.size,
                                ),
                                borderRadius: `var(--dui-radius-${props.radius})`,
                              },
                            ],
                          },
                          [
                            props.title || props.withCloseButton
                              ? h("header", { class: "dui-Drawer-header" }, [
                                  props.title
                                    ? h("h2", { id: titleId }, props.title)
                                    : null,
                                  props.withCloseButton
                                    ? h(
                                        "button",
                                        {
                                          type: "button",
                                          "aria-label": "Close drawer",
                                          class: "dui-Drawer-close",
                                          onClick: close,
                                        },
                                        "×",
                                      )
                                    : null,
                                ])
                              : null,
                            h(
                              "div",
                              { class: "dui-Drawer-body" },
                              slots.default?.(),
                            ),
                            slots.footer
                              ? h(
                                  "footer",
                                  { class: "dui-Drawer-footer" },
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
