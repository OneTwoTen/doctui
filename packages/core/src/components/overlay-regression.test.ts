import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { h } from "vue";
import { DoctuiProvider, Modal, Overlay } from "../index";

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("overlay visual regressions", () => {
  it("carries provider theme variables into the teleported overlay tree", () => {
    const wrapper = mount(DoctuiProvider, {
      props: {
        theme: {
          colors: {
            light: {
              neutral: {
                filled: "#123456",
              },
            },
          },
        },
      },
      slots: {
        default: () => h(Overlay, { modelValue: true }),
      },
      attachTo: document.body,
    });

    const overlay = document.querySelector<HTMLElement>(".dui-Overlay");
    expect(overlay?.style.getPropertyValue("--dui-color-neutral-filled")).toBe(
      "#123456",
    );
    expect(overlay?.style.getPropertyValue("--dui-z-index-overlay")).not.toBe("");

    wrapper.unmount();
  });

  it("gives the overlay surface a full-width geometry context", () => {
    const wrapper = mount(Overlay, {
      props: { modelValue: true },
      attachTo: document.body,
    });

    const surface = document.querySelector<HTMLElement>(
      "[data-dui-overlay-surface]",
    );
    expect(surface?.style.width).toBe("100%");

    wrapper.unmount();
  });

  it("maps modal size to an observable width variable", () => {
    const xs = mount(Modal, {
      props: { modelValue: true, title: "Small", size: "xs" },
      attachTo: document.body,
    });
    expect(
      document
        .querySelector<HTMLElement>(".dui-Modal")
        ?.style.getPropertyValue("--dui-modal-width"),
    ).toBe("20rem");
    xs.unmount();

    const xl = mount(Modal, {
      props: { modelValue: true, title: "Large", size: "xl" },
      attachTo: document.body,
    });
    expect(
      document
        .querySelector<HTMLElement>(".dui-Modal")
        ?.style.getPropertyValue("--dui-modal-width"),
    ).toBe("56rem");
    xl.unmount();
  });

  it("exposes modal backdrop controls through public props", () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: "Backdrop controls",
        withOverlay: false,
        overlayProps: { color: "danger", opacity: 0.25 },
      } as never,
      attachTo: document.body,
    });

    const overlay = document.querySelector<HTMLElement>(".dui-Overlay");
    expect(overlay?.dataset.withBackdrop).toBe("false");
    expect(overlay?.style.getPropertyValue("--dui-overlay-opacity")).toBe("0.25");

    wrapper.unmount();
  });
});
