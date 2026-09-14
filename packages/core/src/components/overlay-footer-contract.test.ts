import { readFile } from "node:fs/promises";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { h } from "vue";
import { Drawer, Modal } from "../index";

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("overlay footer contract", () => {
  it.each([
    [Modal, ".dui-Modal", ".dui-Modal-body", ".dui-Modal-footer"],
    [Drawer, ".dui-Drawer", ".dui-Drawer-body", ".dui-Drawer-footer"],
  ] as const)(
    "%s renders body and footer as separate regions",
    (Component, rootSelector, bodySelector, footerSelector) => {
      const wrapper = mount(Component, {
        props: { modelValue: true, title: "Actions" } as never,
        slots: {
          default: () => h("p", { id: "body-content" }, "Body"),
          footer: () => h("button", { id: "footer-action" }, "Save"),
        },
        attachTo: document.body,
      });

      const root = document.querySelector(rootSelector);
      const body = document.querySelector(bodySelector);
      const footer = document.querySelector(footerSelector);

      expect(root).not.toBeNull();
      expect(body?.querySelector("#body-content")).not.toBeNull();
      expect(footer?.tagName).toBe("FOOTER");
      expect(footer?.querySelector("#footer-action")).not.toBeNull();
      expect(root?.children[root.children.length - 1]).toBe(footer);

      wrapper.unmount();
    },
  );

  it.each([
    [Modal, ".dui-Modal-footer"],
    [Drawer, ".dui-Drawer-footer"],
  ] as const)(
    "%s does not render an empty footer",
    (Component, footerSelector) => {
      const wrapper = mount(Component, {
        props: { modelValue: true, title: "No actions" } as never,
        slots: { default: () => "Body" },
        attachTo: document.body,
      });

      expect(document.querySelector(footerSelector)).toBeNull();
      wrapper.unmount();
    },
  );

  it("keeps overlay chrome stable while body content scrolls", async () => {
    const css = await readFile(
      new URL("../overlay-footer.css", import.meta.url),
      "utf8",
    );

    expect(css).toContain(".dui-Modal,");
    expect(css).toContain(".dui-Drawer {");
    expect(css).toContain("flex-direction: column");
    expect(css).toContain(".dui-Modal-body,");
    expect(css).toContain(".dui-Drawer-body {");
    expect(css).toContain("overflow: auto");
    expect(css).toContain("min-height: 0");
    expect(css).toContain(".dui-Modal-footer,");
    expect(css).toContain(".dui-Drawer-footer {");
    expect(css).toContain("flex-wrap: wrap");
    expect(css).toContain("border-top: 1px solid var(--dui-color-border)");
  });
});
