import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { TagsInput } from "../index";

describe("TagsInput visual contract", () => {
  it("inherits field size geometry and exposes stable visual parts", () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue", "Accessibility"],
        size: "xl",
        clearable: true,
        ariaLabel: "Skills",
      },
    });

    expect(wrapper.get(".dui-InputWrapper").attributes("data-size")).toBe("xl");
    expect(wrapper.get(".dui-TagsInput").attributes("data-size")).toBe("xl");
    expect(wrapper.get(".dui-TagsInput-control")).toBeTruthy();
    expect(wrapper.findAll(".dui-TagsInput-tag")).toHaveLength(2);
    expect(wrapper.get(".dui-TagsInput-input")).toBeTruthy();
    expect(wrapper.get(".dui-TagsInput-clear")).toBeTruthy();
  });

  it("ships token-driven control, tag, focus, error and disabled styles", async () => {
    const cssPath = resolve(
      process.cwd(),
      "packages/core/src/components/field-styles.css",
    );
    const css = await readFile(cssPath, "utf8");

    expect(css).toMatch(
      /\.dui-TagsInput-control\s*\{[^}]*min-height:\s*var\(--dui-field-control-height\)/s,
    );
    expect(css).toMatch(
      /\.dui-TagsInput-control:focus-within\s*\{[^}]*var\(--dui-color-focus-ring\)/s,
    );
    expect(css).toMatch(
      /\.dui-TagsInput-tag\s*\{[^}]*var\(--dui-color-primary-light\)/s,
    );
    expect(css).toMatch(
      /\.dui-TagsInput\[data-error="true"\][^{]*\.dui-TagsInput-control\s*\{[^}]*var\(--dui-color-danger-filled\)/s,
    );
    expect(css).toMatch(
      /\.dui-TagsInput\[data-disabled="true"\][^{]*\.dui-TagsInput-control\s*\{[^}]*var\(--dui-field-disabled-background\)/s,
    );
  });
});
