import { readFileSync } from "node:fs";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import {
  computed,
  defineComponent,
  h,
  nextTick,
  type PropType,
  ref,
} from "vue";
import { Drawer, Modal, Overlay } from "../index";
import { useScrollLock } from "../primitives/useScrollLock";

const ScrollLockHarness = defineComponent({
  props: {
    active: { type: Boolean as PropType<boolean>, required: true },
  },
  setup(props) {
    useScrollLock(computed(() => props.active));
    return () => h("div");
  },
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("overlay contract", () => {
  it("keeps body scroll locked until the last lock instance releases", async () => {
    document.body.style.overflow = "auto";
    const first = mount(ScrollLockHarness, { props: { active: true } });
    const second = mount(ScrollLockHarness, { props: { active: true } });

    expect(document.body.style.overflow).toBe("hidden");

    await first.setProps({ active: false });
    expect(document.body.style.overflow).toBe("hidden");

    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    second.unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("closes Drawer on Escape only when closeOnEscape is enabled", async () => {
    const enabled = mount(Drawer, {
      props: { modelValue: true, title: "Filters" },
      attachTo: document.body,
    });
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(enabled.emitted("update:modelValue")).toEqual([[false]]);
    enabled.unmount();

    const disabled = mount(Drawer, {
      props: {
        modelValue: true,
        title: "Filters",
        closeOnEscape: false,
      },
      attachTo: document.body,
    });
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(disabled.emitted("update:modelValue")).toBeUndefined();
    disabled.unmount();
  });

  it("honors outside-click dismissal flags for Modal and Drawer", async () => {
    const modal = mount(Modal, {
      props: {
        modelValue: true,
        title: "Review",
        closeOnClickOutside: false,
      },
      attachTo: document.body,
    });
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(modal.emitted("update:modelValue")).toBeUndefined();
    modal.unmount();

    const drawer = mount(Drawer, {
      props: { modelValue: true, title: "Filters" },
      attachTo: document.body,
    });
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    expect(drawer.emitted("update:modelValue")).toEqual([[false]]);
    drawer.unmount();
  });

  it("gives untitled Modal and Drawer dialogs a safe accessible name", () => {
    const modal = mount(Modal, {
      props: { modelValue: true, withCloseButton: false },
      attachTo: document.body,
    });
    expect(
      document
        .querySelector<HTMLElement>(".dui-Modal")
        ?.getAttribute("aria-label"),
    ).toBe("Dialog");
    modal.unmount();

    const drawer = mount(Drawer, {
      props: { modelValue: true, withCloseButton: false },
      attachTo: document.body,
    });
    expect(
      document
        .querySelector<HTMLElement>(".dui-Drawer")
        ?.getAttribute("aria-label"),
    ).toBe("Drawer");
    drawer.unmount();
  });

  it("maps Overlay color and opacity to backdrop CSS variables without fading content", () => {
    const wrapper = mount(Overlay, {
      props: {
        modelValue: true,
        color: "danger",
        opacity: 0.4,
      },
      attachTo: document.body,
    });
    const overlay = document.querySelector<HTMLElement>(".dui-Overlay");

    expect(overlay?.style.getPropertyValue("--dui-overlay-color")).toBe(
      "var(--dui-color-danger-filled)",
    );
    expect(overlay?.style.getPropertyValue("--dui-overlay-opacity")).toBe(
      "0.4",
    );
    expect(overlay?.style.opacity).toBe("");
    wrapper.unmount();
  });

  it("makes Modal centering observable on the shared backdrop", () => {
    const centered = mount(Modal, {
      props: { modelValue: true, title: "Centered", centered: true },
      attachTo: document.body,
    });
    expect(
      document.querySelector<HTMLElement>(".dui-Overlay")?.dataset.align,
    ).toBe("center");
    centered.unmount();

    const topAligned = mount(Modal, {
      props: { modelValue: true, title: "Top aligned", centered: false },
      attachTo: document.body,
    });
    expect(
      document.querySelector<HTMLElement>(".dui-Overlay")?.dataset.align,
    ).toBe("start");
    topAligned.unmount();
  });

  it("maps dialog sizes and layering to public CSS state and theme z-index tokens", () => {
    const css = readFileSync("packages/core/src/styles.css", "utf8");

    for (const size of ["xs", "sm", "md", "lg", "xl"]) {
      expect(css).toContain(`.dui-Modal[data-size="${size}"]`);
      expect(css).toContain(`.dui-Drawer[data-size="${size}"]`);
    }
    expect(css).toContain("z-index: var(--dui-z-index-overlay);");
    expect(css).toContain("z-index: var(--dui-z-index-modal);");
    expect(css).not.toContain("z-index: 1001;");
  });

  it("keeps Escape and focus restoration scoped to the top nested dialog", async () => {
    const Host = defineComponent({
      setup() {
        const modalOpen = ref(false);
        const drawerOpen = ref(false);
        return () =>
          h("div", [
            h(
              "button",
              {
                id: "open-modal",
                type: "button",
                onClick: () => (modalOpen.value = true),
              },
              "Open modal",
            ),
            h(
              Modal,
              {
                modelValue: modalOpen.value,
                title: "Parent dialog",
                "onUpdate:modelValue": (value: boolean) =>
                  (modalOpen.value = value),
              },
              {
                default: () =>
                  h(
                    "button",
                    {
                      id: "open-drawer",
                      type: "button",
                      onClick: () => (drawerOpen.value = true),
                    },
                    "Open drawer",
                  ),
              },
            ),
            h(
              Drawer,
              {
                modelValue: drawerOpen.value,
                title: "Child drawer",
                "onUpdate:modelValue": (value: boolean) =>
                  (drawerOpen.value = value),
              },
              {
                default: () => h("button", { type: "button" }, "Drawer action"),
              },
            ),
          ]);
      },
    });

    const host = mount(Host, { attachTo: document.body });
    const opener = document.querySelector<HTMLButtonElement>("#open-modal");
    opener?.focus();
    opener?.click();
    await nextTick();
    await nextTick();

    const drawerTrigger =
      document.querySelector<HTMLButtonElement>("#open-drawer");
    drawerTrigger?.focus();
    drawerTrigger?.click();
    await nextTick();
    await nextTick();

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await nextTick();
    expect(document.querySelector(".dui-Drawer")).toBeNull();
    expect(document.querySelector(".dui-Modal")).not.toBeNull();
    expect(document.activeElement).toBe(drawerTrigger);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await nextTick();
    expect(document.querySelector(".dui-Modal")).toBeNull();
    expect(document.activeElement).toBe(opener);

    host.unmount();
  });
});
