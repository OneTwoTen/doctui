import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Checkbox, Radio, SegmentedControl, Switch } from "../index";

const readControlStyles = () =>
  readFile(
    resolve(process.cwd(), "packages/core/src/components/control-styles.css"),
    "utf8",
  );

describe("control visual contract", () => {
  it("exposes the complete size scale on boolean controls and SegmentedControl", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    for (const size of sizes) {
      const checkbox = mount(Checkbox, {
        props: { label: size, modelValue: true, size },
      });
      const radio = mount(Radio, {
        props: { label: size, value: size, modelValue: size, size },
      });
      const toggle = mount(Switch, {
        props: { label: size, modelValue: true, size },
      });
      const segmented = mount(SegmentedControl, {
        props: {
          ariaLabel: `${size} density`,
          modelValue: "comfortable",
          size,
          data: [
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
          ],
        },
      });

      expect(checkbox.get(".dui-Checkbox").attributes("data-size")).toBe(size);
      expect(radio.get(".dui-Radio").attributes("data-size")).toBe(size);
      expect(toggle.get(".dui-Switch").attributes("data-size")).toBe(size);
      expect(segmented.attributes("data-size")).toBe(size);
    }
  });

  it("styles custom checkbox, radio and switch visuals while preserving native inputs", async () => {
    const css = await readControlStyles();

    expect(css).toMatch(/\.dui-Checkbox-input[\s\S]*position:\s*absolute/);
    expect(css).toMatch(
      /\.dui-Checkbox-input:focus-visible\s*\+\s*\.dui-Checkbox-control/,
    );
    expect(css).toMatch(
      /\.dui-Checkbox-input:checked\s*\+\s*\.dui-Checkbox-control/,
    );
    expect(css).toMatch(
      /\.dui-Radio-input:checked\s*\+\s*\.dui-Radio-control::after/,
    );
    expect(css).toMatch(
      /\.dui-Switch-input:checked\s*\+\s*\.dui-Switch-track/,
    );
    expect(css).toMatch(
      /\.dui-Switch-input:checked\s*\+\s*\.dui-Switch-track\s+\.dui-Switch-thumb/,
    );
  });

  it("styles disabled/error states and all SegmentedControl interaction states", async () => {
    const css = await readControlStyles();

    expect(css).toMatch(/\.dui-Checkbox\[data-disabled="true"\]/);
    expect(css).toMatch(/\.dui-Radio\[data-error="true"\]/);
    expect(css).toMatch(/\.dui-Switch\[data-disabled="true"\]/);
    expect(css).toMatch(/\.dui-SegmentedControl\[data-size="xl"\]/);
    expect(css).toMatch(
      /\.dui-SegmentedControl-option\[data-active="true"\]/,
    );
    expect(css).toMatch(/\.dui-SegmentedControl-option:hover:not\(:disabled\)/);
    expect(css).toMatch(/\.dui-SegmentedControl\[data-disabled="true"\]/);
  });
});
