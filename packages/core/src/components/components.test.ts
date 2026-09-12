import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { Box, Button, Flex, Group, Stack, Text, Title } from "../index";

describe("Phase 2 component contracts", () => {
  it("renders Box as the requested element and maps spacing to theme tokens", () => {
    const wrapper = mount(Box, {
      props: { as: "section", padding: "lg", margin: "sm" },
      slots: { default: "content" },
    });

    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.text()).toBe("content");
    expect(wrapper.attributes("style")).toContain(
      "padding: var(--dui-spacing-lg)",
    );
    expect(wrapper.attributes("style")).toContain(
      "margin: var(--dui-spacing-sm)",
    );
  });

  it("provides Flex, Stack and Group layout defaults without hiding CSS semantics", () => {
    const flex = mount(Flex, {
      props: { gap: "sm", align: "center", justify: "space-between" },
    });
    const stack = mount(Stack, { props: { gap: "lg" } });
    const group = mount(Group, { props: { gap: "xs" } });

    expect(flex.attributes("style")).toContain("display: flex");
    expect(flex.attributes("style")).toContain("gap: var(--dui-spacing-sm)");
    expect(flex.attributes("style")).toContain("align-items: center");
    expect(flex.attributes("style")).toContain(
      "justify-content: space-between",
    );
    expect(stack.attributes("style")).toContain("flex-direction: column");
    expect(group.attributes("style")).toContain("flex-wrap: wrap");
  });

  it("renders Text and Title with semantic typography defaults", () => {
    const text = mount(Text, {
      props: { as: "span", size: "sm", muted: true },
      slots: { default: "Secondary" },
    });
    const title = mount(Title, {
      props: { order: 3 },
      slots: { default: "Heading" },
    });

    expect(text.element.tagName).toBe("SPAN");
    expect(text.attributes("style")).toContain(
      "font-size: var(--dui-font-size-sm)",
    );
    expect(text.attributes("data-muted")).toBe("true");
    expect(title.element.tagName).toBe("H3");
  });

  it("keeps Button keyboard-native and exposes variant state through data attributes", async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      props: {
        color: "success",
        variant: "light",
        size: "lg",
        radius: "xl",
        onClick,
      },
      slots: { default: "Save" },
    });

    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.attributes("type")).toBe("button");
    expect(wrapper.attributes("data-color")).toBe("success");
    expect(wrapper.attributes("data-variant")).toBe("light");
    expect(wrapper.attributes("data-size")).toBe("lg");
    expect(wrapper.attributes("data-radius")).toBe("xl");

    await wrapper.trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables Button interaction while loading and communicates busy state", async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      props: { loading: true, onClick },
      slots: { default: "Submit" },
    });

    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.attributes("aria-busy")).toBe("true");
    expect(wrapper.get("[data-dui-button-loader]")).toBeDefined();

    await wrapper.trigger("click");
    expect(onClick).not.toHaveBeenCalled();
  });
});
