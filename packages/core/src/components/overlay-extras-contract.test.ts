import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import { Menu, Popover, Tooltip } from "../index";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Menu interaction contract", () => {
  const data = [
    { value: "edit", label: "Edit" },
    { value: "delete", label: "Delete", disabled: true },
    { value: "archive", label: "Archive" },
  ] as const;

  it("connects the trigger to the menu and opens with one focused enabled item", async () => {
    const wrapper = mount(Menu, {
      props: { modelValue: false, data },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });

    const trigger = wrapper.get("button");
    expect(trigger.attributes("aria-haspopup")).toBe("menu");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(trigger.attributes("aria-controls")).toBeTruthy();

    await trigger.trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([true]);

    await wrapper.setProps({ modelValue: true });
    await nextTick();

    const menu = wrapper.get("[role='menu']");
    expect(menu.attributes("id")).toBe(trigger.attributes("aria-controls"));
    expect(trigger.attributes("aria-expanded")).toBe("true");

    const items = wrapper.findAll("[role='menuitem']");
    expect(items.map((item) => item.attributes("tabindex"))).toEqual([
      "0",
      "-1",
      "-1",
    ]);
    expect(document.activeElement).toBe(items[0]?.element);

    wrapper.unmount();
  });

  it("uses roving focus, skips disabled items, and selects with keyboard", async () => {
    const wrapper = mount(Menu, {
      props: { modelValue: true, data },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });
    await nextTick();

    const items = wrapper.findAll("[role='menuitem']");
    expect(document.activeElement).toBe(items[0]?.element);

    await items[0]?.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[2]?.element);
    expect(items[2]?.attributes("tabindex")).toBe("0");

    await items[2]?.trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(items[0]?.element);

    await items[0]?.trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(items[2]?.element);

    await items[2]?.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("select")?.at(-1)).toEqual(["archive"]);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);

    wrapper.unmount();
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const wrapper = mount(Menu, {
      props: { modelValue: true, data },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });
    await nextTick();

    const trigger = wrapper.get("button[aria-haspopup='menu']");
    const firstItem = wrapper.get("[role='menuitem']");
    firstItem.element.focus();
    await firstItem.trigger("keydown", { key: "Escape" });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(trigger.element);

    wrapper.unmount();
  });

  it("dismisses on outside pointer interaction", async () => {
    const wrapper = mount(Menu, {
      props: { modelValue: true, data },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });
    await nextTick();

    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
    wrapper.unmount();
  });
});

describe("Popover interaction contract", () => {
  it("connects its trigger and panel, closes on Escape, and restores trigger focus", async () => {
    const wrapper = mount(Popover, {
      props: { modelValue: true },
      slots: {
        target: () => h("button", { type: "button" }, "Details"),
        default: () => h("button", { type: "button" }, "Panel action"),
      },
      attachTo: document.body,
    });
    await nextTick();

    const trigger = wrapper.get("button[aria-haspopup='dialog']");
    const panel = wrapper.get("[role='dialog']");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("aria-controls")).toBe(panel.attributes("id"));

    const panelAction = wrapper.get("[role='dialog'] button");
    panelAction.element.focus();
    await panelAction.trigger("keydown", { key: "Escape" });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(trigger.element);

    wrapper.unmount();
  });

  it("honors outside-dismissal configuration", async () => {
    const enabled = mount(Popover, {
      props: { modelValue: true },
      slots: {
        target: () => h("button", { type: "button" }, "Enabled"),
        default: () => "Panel",
      },
      attachTo: document.body,
    });
    await nextTick();
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    await nextTick();
    expect(enabled.emitted("update:modelValue")?.at(-1)).toEqual([false]);
    enabled.unmount();

    const disabled = mount(Popover, {
      props: { modelValue: true, closeOnClickOutside: false },
      slots: {
        target: () => h("button", { type: "button" }, "Disabled"),
        default: () => "Panel",
      },
      attachTo: document.body,
    });
    await nextTick();
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    await nextTick();
    expect(disabled.emitted("update:modelValue")).toBeUndefined();
    disabled.unmount();
  });
});

describe("Tooltip interaction contract", () => {
  it("describes the actual trigger instead of an implementation wrapper", async () => {
    const wrapper = mount(Tooltip, {
      props: { label: "Helpful context" },
      slots: { default: () => h("button", { type: "button" }, "Info") },
      attachTo: document.body,
    });

    const trigger = wrapper.get("button");
    await trigger.trigger("focusin");
    await nextTick();

    const tooltip = wrapper.get("[role='tooltip']");
    expect(trigger.attributes("aria-describedby")).toBe(
      tooltip.attributes("id"),
    );
    expect(wrapper.attributes("aria-describedby")).toBeUndefined();

    wrapper.unmount();
  });

  it("stays open while focus moves within a composite trigger", async () => {
    const wrapper = mount(Tooltip, {
      props: { label: "Composite help" },
      slots: {
        default: () =>
          h("span", { "data-composite-trigger": "" }, [
            h("button", { type: "button" }, "Previous"),
            h("button", { type: "button" }, "Next"),
          ]),
      },
      attachTo: document.body,
    });

    const composite = wrapper.get("[data-composite-trigger]");
    const buttons = wrapper.findAll("button");
    await buttons[0]?.trigger("focusin");
    await nextTick();
    expect(wrapper.find("[role='tooltip']").exists()).toBe(true);

    await buttons[0]?.trigger("focusout", {
      relatedTarget: buttons[1]?.element,
    });
    await buttons[1]?.trigger("focusin");
    await nextTick();
    expect(wrapper.find("[role='tooltip']").exists()).toBe(true);
    expect(composite.attributes("aria-describedby")).toBeTruthy();

    await buttons[1]?.trigger("focusout", { relatedTarget: document.body });
    await nextTick();
    expect(wrapper.find("[role='tooltip']").exists()).toBe(false);

    wrapper.unmount();
  });
});
