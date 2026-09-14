import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Divider, Loader, VisuallyHidden } from "../index";

const readCoreStyles = () =>
  readFile(resolve(process.cwd(), "packages/core/src/styles.css"), "utf8");

const readOverlayStyles = () =>
  readFile(
    resolve(
      process.cwd(),
      "packages/core/src/components/overlay-extras-styles.css",
    ),
    "utf8",
  );

describe("semantic theme visual contract", () => {
  it("maps Divider color to the matching semantic outline token", () => {
    const wrapper = mount(Divider, {
      props: { color: "danger", size: "sm" },
    });

    expect(wrapper.attributes("data-color")).toBe("danger");
    expect(wrapper.attributes("style")).toContain(
      "var(--dui-color-danger-outline)",
    );
  });

  it("maps Loader color to the matching semantic filled token", () => {
    const wrapper = mount(Loader, {
      props: { color: "warning", size: "lg" },
    });

    expect(wrapper.attributes("data-color")).toBe("warning");
    expect(wrapper.attributes("style")).toContain(
      "color: var(--dui-color-warning-filled)",
    );
  });

  it("keeps VisuallyHidden hidden until a focusable instance receives focus", async () => {
    const hidden = mount(VisuallyHidden, {
      slots: { default: "Screen reader only" },
    });
    const focusable = mount(VisuallyHidden, {
      attrs: { tabindex: "0" },
      props: { focusable: true },
      slots: { default: "Skip to content" },
    });
    const css = await readCoreStyles();

    expect(hidden.attributes("data-focusable")).toBe("false");
    expect(focusable.attributes("data-focusable")).toBe("true");
    expect(css).toMatch(
      /\.dui-VisuallyHidden\[data-focusable="true"\]:(?:focus|focus-visible)[\s\S]*clip:\s*auto/,
    );
  });

  it("uses dedicated z-index tokens for core and contextual overlays", async () => {
    const [coreCss, overlayCss] = await Promise.all([
      readCoreStyles(),
      readOverlayStyles(),
    ]);

    expect(coreCss).toMatch(/\.dui-Overlay[\s\S]*z-index:\s*var\(--dui-z-index-overlay\)/);
    expect(coreCss).toMatch(/\.dui-Drawer[\s\S]*z-index:\s*var\(--dui-z-index-modal\)/);
    expect(overlayCss).toMatch(/\.dui-Popover-panel[\s\S]*z-index:\s*var\(--dui-z-index-popover\)/);
    expect(overlayCss).toMatch(/\.dui-Tooltip-content[\s\S]*z-index:\s*var\(--dui-z-index-tooltip\)/);
  });
});
