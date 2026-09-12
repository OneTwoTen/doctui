import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Checkbox, TextInput } from "../index";

describe("field part styles API", () => {
  it("applies classNames and styles to TextInput parts without changing native attr forwarding", () => {
    const wrapper = mount(TextInput as never, {
      props: {
        label: "Email",
        classNames: {
          root: "custom-root",
          label: "custom-label",
          wrapper: "custom-wrapper",
          input: "custom-input",
        },
        styles: {
          root: { marginBottom: "16px" },
          wrapper: { backgroundColor: "rgb(1, 2, 3)" },
          input: { letterSpacing: "1px" },
        },
      } as never,
      attrs: { name: "email" },
    });

    expect(wrapper.get(".dui-InputWrapper").classes()).toContain("custom-root");
    expect(wrapper.get(".dui-InputWrapper-label").classes()).toContain(
      "custom-label",
    );
    expect(wrapper.get(".dui-TextInput").classes()).toContain("custom-wrapper");
    expect(wrapper.get(".dui-TextInput").attributes("style")).toContain(
      "background-color: rgb(1, 2, 3)",
    );
    expect(wrapper.get("input").classes()).toContain("custom-input");
    expect(wrapper.get("input").attributes("style")).toContain(
      "letter-spacing: 1px",
    );
    expect(wrapper.get("input").attributes("name")).toBe("email");
  });

  it("targets boolean body, indicator and label text parts", () => {
    const wrapper = mount(Checkbox as never, {
      props: {
        label: "Accept",
        classNames: {
          body: "custom-body",
          indicator: "custom-indicator",
          labelText: "custom-label-text",
        },
        styles: {
          indicator: { outlineOffset: "4px" },
        },
      } as never,
    });

    expect(wrapper.get(".dui-Checkbox").classes()).toContain("custom-body");
    expect(wrapper.get(".dui-Checkbox-control").classes()).toContain(
      "custom-indicator",
    );
    expect(wrapper.get(".dui-Checkbox-control").attributes("style")).toContain(
      "outline-offset: 4px",
    );
    expect(wrapper.get(".dui-Checkbox-label").classes()).toContain(
      "custom-label-text",
    );
  });
});
