import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import { Menu, Popover, Tooltip } from "../index";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("contextual overlay interaction details", () => {
  it("opens Menu from ArrowUp at the last enabled item", async () => {
    const wrapper = mount(Menu, {
      props: {
        modelValue: false,
        data: [
          { value: "first", label: "First" },
          { value: "disabled", label: "Disabled", disabled: true },
          { value: "last", label: "Last" },
        ],
      },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });

    await wrapper.get("button").trigger("keydown", { key: "ArrowUp" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([true]);

    await wrapper.setProps({ modelValue: true });
    await nextTick();

    const items = wrapper.findAll("[role='menuitem']");
    expect(document.activeElement).toBe(items[2]?.element);
    wrapper.unmount();
  });

  it("selects the focused Menu item with Space", async () => {
    const wrapper = mount(Menu, {
      props: {
        modelValue: true,
        data: [
          { value: "edit", label: "Edit" },
          { value: "archive", label: "Archive" },
        ],
      },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });
    await nextTick();

    await wrapper.get("[role='menuitem']").trigger("keydown", { key: " " });
    expect(wrapper.emitted("select")?.at(-1)).toEqual(["edit"]);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
    wrapper.unmount();
  });

  it("keeps Popover open on Escape when closeOnEscape is disabled", async () => {
    const wrapper = mount(Popover, {
      props: { modelValue: true, closeOnEscape: false },
      slots: {
        target: () => h("button", { type: "button" }, "Details"),
        default: () => h("button", { type: "button" }, "Panel action"),
      },
      attachTo: document.body,
    });
    await nextTick();

    await wrapper.get("[role='dialog'] button").trigger("keydown", {
      key: "Escape",
    });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    wrapper.unmount();
  });

  it("opens Tooltip on hover and describes the slotted trigger", async () => {
    const wrapper = mount(Tooltip, {
      props: { label: "Helpful context" },
      slots: { default: () => h("button", { type: "button" }, "Info") },
      attachTo: document.body,
    });

    const trigger = wrapper.get("button");
    await trigger.trigger("mouseenter");
    await nextTick();

    const tooltip = wrapper.get("[role='tooltip']");
    expect(trigger.attributes("aria-describedby")).toBe(
      tooltip.attributes("id"),
    );

    await trigger.trigger("mouseleave");
    await nextTick();
    expect(wrapper.find("[role='tooltip']").exists()).toBe(false);
    wrapper.unmount();
  });
});
