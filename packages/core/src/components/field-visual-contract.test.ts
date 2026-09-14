import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Checkbox, Radio, Switch, TextInput } from "../index";

describe("field visual contract", () => {
  it("treats consumer class/style as the outer field root while native attrs stay on the control", () => {
    const wrapper = mount(TextInput, {
      props: {
        label: "Email",
        size: "xl",
      },
      attrs: {
        class: "consumer-field",
        style: {
          marginTop: "12px",
          "--dui-field-control-height": "4rem",
        },
        name: "email",
        autocomplete: "email",
      },
    });

    const root = wrapper.get(".dui-InputWrapper");
    const visualControl = wrapper.get(".dui-TextInput");
    const input = wrapper.get("input");

    expect(root.classes()).toContain("consumer-field");
    expect(root.attributes("style")).toContain("margin-top: 12px");
    expect(root.attributes("style")).toContain(
      "--dui-field-control-height: 4rem",
    );
    expect(root.attributes("data-size")).toBe("xl");
    expect(visualControl.classes()).not.toContain("consumer-field");
    expect(input.attributes("name")).toBe("email");
    expect(input.attributes("autocomplete")).toBe("email");
  });

  it("renders the required marker as a stable danger-colored style part", async () => {
    const wrapper = mount(TextInput, {
      props: {
        label: "Email",
        required: true,
      },
    });

    expect(wrapper.get(".dui-InputWrapper-required").text()).toBe("*");

    const cssPath = resolve(
      process.cwd(),
      "packages/core/src/components/field-styles.css",
    );
    const css = await readFile(cssPath, "utf8");
    expect(css).toMatch(
      /\.dui-InputWrapper-required\s*\{[^}]*color:\s*var\(--dui-color-danger-filled\)/s,
    );
  });

  it("renders explicit custom visual parts while preserving native boolean controls", () => {
    const checkbox = mount(Checkbox, {
      props: { label: "Accept", modelValue: true, size: "lg" },
    });
    expect(checkbox.get(".dui-Checkbox-input").attributes("type")).toBe(
      "checkbox",
    );
    expect(checkbox.get(".dui-Checkbox-control")).toBeTruthy();
    expect(checkbox.get(".dui-InputWrapper").attributes("data-size")).toBe(
      "lg",
    );

    const radio = mount(Radio, {
      props: {
        label: "Pro",
        value: "pro",
        modelValue: "pro",
        name: "plan",
      },
    });
    expect(radio.get(".dui-Radio-input").attributes("type")).toBe("radio");
    expect(radio.get(".dui-Radio-control")).toBeTruthy();

    const toggle = mount(Switch, {
      props: { label: "Enabled", modelValue: true },
    });
    const switchInput = toggle.get(".dui-Switch-input");
    expect(switchInput.attributes("type")).toBe("checkbox");
    expect(switchInput.attributes("role")).toBe("switch");
    expect(toggle.get(".dui-Switch-track")).toBeTruthy();
    expect(toggle.get(".dui-Switch-thumb")).toBeTruthy();
  });

  it("surfaces disabled state on both the field root and visual boolean control", () => {
    const wrapper = mount(Switch, {
      props: { label: "Enabled", disabled: true, size: "sm" },
    });

    expect(wrapper.get(".dui-InputWrapper").attributes("data-disabled")).toBe(
      "true",
    );
    expect(wrapper.get(".dui-InputWrapper").attributes("data-size")).toBe("sm");
    expect(wrapper.get(".dui-Switch").attributes("data-disabled")).toBe("true");
    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
  });
});
