import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h } from "vue";
import { Popover } from "../index";

const readStyles = () =>
  readFile(
    resolve(
      process.cwd(),
      "packages/core/src/components/overlay-extras-styles.css",
    ),
    "utf8",
  );

describe("contextual overlay visual contract", () => {
  it("names Popover dialogs from their real trigger", () => {
    const wrapper = mount(Popover, {
      props: { modelValue: true },
      slots: {
        target: () => h("button", { type: "button" }, "Workspace details"),
        default: () => "Popover content",
      },
    });

    const trigger = wrapper.get("button");
    const panel = wrapper.get("[role='dialog']");
    expect(trigger.attributes("id")).toBeTruthy();
    expect(panel.attributes("aria-labelledby")).toBe(trigger.attributes("id"));
  });

  it("keeps contextual surfaces readable and viewport-safe", async () => {
    const css = await readStyles();

    expect(css).toMatch(
      /\.dui-Popover-panel,[\s\S]*\.dui-Menu-dropdown[\s\S]*box-sizing:\s*border-box/,
    );
    expect(css).toMatch(
      /\.dui-Popover-panel,[\s\S]*\.dui-Menu-dropdown[\s\S]*background:\s*var\(--dui-color-surface-raised\)/,
    );
    expect(css).toMatch(/\.dui-Tooltip-content[\s\S]*white-space:\s*normal/);
    expect(css).toMatch(
      /\.dui-Tooltip-content[\s\S]*overflow-wrap:\s*anywhere/,
    );
    expect(css).toMatch(/\.dui-Tooltip-content[\s\S]*pointer-events:\s*none/);
  });
});
