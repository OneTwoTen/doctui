import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import { Checkbox, Radio, SegmentedControl, Switch } from "../index";

const DATA = [
  { value: "list", label: "List", disabled: true },
  { value: "grid", label: "Grid" },
  { value: "board", label: "Board", disabled: true },
  { value: "table", label: "Table" },
] as const;

describe("SegmentedControl keyboard semantics", () => {
  it("keeps exactly one enabled keyboard entry point without a valid selection", async () => {
    const wrapper = mount(SegmentedControl, {
      props: { ariaLabel: "View", data: DATA },
    });

    let buttons = wrapper.findAll("button");
    expect(buttons.map((button) => button.attributes("tabindex"))).toEqual([
      "-1",
      "0",
      "-1",
      "-1",
    ]);

    await wrapper.setProps({ modelValue: "missing" });
    buttons = wrapper.findAll("button");
    expect(buttons.map((button) => button.attributes("tabindex"))).toEqual([
      "-1",
      "0",
      "-1",
      "-1",
    ]);

    await wrapper.setProps({ modelValue: "list" });
    buttons = wrapper.findAll("button");
    expect(buttons.map((button) => button.attributes("tabindex"))).toEqual([
      "-1",
      "0",
      "-1",
      "-1",
    ]);
  });

  it("moves and selects with arrows while skipping disabled options", async () => {
    const model = ref<string | number>("grid");
    const wrapper = mount(SegmentedControl, {
      props: {
        ariaLabel: "View",
        data: DATA,
        modelValue: model.value,
        "onUpdate:modelValue": async (value: string | number) => {
          model.value = value;
          await wrapper.setProps({ modelValue: value });
        },
      },
      attachTo: document.body,
    });

    let buttons = wrapper.findAll("button");
    buttons[1].element.focus();
    await buttons[1].trigger("keydown", { key: "ArrowRight" });
    await nextTick();

    buttons = wrapper.findAll("button");
    expect(document.activeElement).toBe(buttons[3].element);
    expect(model.value).toBe("table");
    expect(buttons[3].attributes("aria-checked")).toBe("true");
    expect(buttons[3].attributes("tabindex")).toBe("0");
    expect(buttons[1].attributes("tabindex")).toBe("-1");

    await buttons[3].trigger("keydown", { key: "ArrowRight" });
    await nextTick();
    buttons = wrapper.findAll("button");
    expect(document.activeElement).toBe(buttons[1].element);
    expect(model.value).toBe("grid");

    wrapper.unmount();
  });

  it("uses Home and End to select the first and last enabled options", async () => {
    const wrapper = mount(SegmentedControl, {
      props: { ariaLabel: "View", data: DATA, modelValue: "grid" },
      attachTo: document.body,
    });

    let buttons = wrapper.findAll("button");
    buttons[3].element.focus();
    await buttons[3].trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(buttons[1].element);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["grid"]);

    await buttons[1].trigger("keydown", { key: "End" });
    buttons = wrapper.findAll("button");
    expect(document.activeElement).toBe(buttons[3].element);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["table"]);

    wrapper.unmount();
  });

  it("selects the focused enabled option with Enter and Space", async () => {
    const wrapper = mount(SegmentedControl, {
      props: { ariaLabel: "View", data: DATA, modelValue: "grid" },
    });
    const buttons = wrapper.findAll("button");

    await buttons[3].trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["table"]);

    await buttons[1].trigger("keydown", { key: " " });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["grid"]);
  });

  it("removes every option from the tab order when the whole group is disabled", () => {
    const wrapper = mount(SegmentedControl, {
      props: { ariaLabel: "View", data: DATA, disabled: true },
    });

    for (const button of wrapper.findAll("button")) {
      expect(button.attributes("disabled")).toBeDefined();
      expect(button.attributes("tabindex")).toBe("-1");
      expect(button.attributes("aria-disabled")).toBe("true");
    }
  });
});

describe("native boolean and radio controls", () => {
  it("preserves native input semantics, labels and names", () => {
    const checkbox = mount(Checkbox, {
      props: { id: "terms", label: "Accept terms" },
      attrs: { name: "terms" },
    });
    const radio = mount(Radio, {
      props: {
        id: "plan-pro",
        label: "Pro",
        name: "plan",
        value: "pro",
        modelValue: "free",
      },
    });
    const toggle = mount(Switch, {
      props: { id: "alerts", label: "Alerts" },
      attrs: { name: "alerts" },
    });

    expect(checkbox.get("input").attributes("type")).toBe("checkbox");
    expect(checkbox.get("input").attributes("name")).toBe("terms");
    expect(checkbox.get("label").attributes("for")).toBe("terms");

    expect(radio.get("input").attributes("type")).toBe("radio");
    expect(radio.get("input").attributes("name")).toBe("plan");
    expect(radio.get("input").attributes("id")).toBe("plan-pro");

    expect(toggle.get("input").attributes("type")).toBe("checkbox");
    expect(toggle.get("input").attributes("role")).toBe("switch");
    expect(toggle.get("input").attributes("name")).toBe("alerts");
  });

  it("exposes size and disabled state consistently on control roots", () => {
    const checkbox = mount(Checkbox, {
      props: { label: "Accept", size: "sm", disabled: true },
    });
    const radio = mount(Radio, {
      props: { label: "Pro", value: "pro", size: "lg", disabled: true },
    });
    const toggle = mount(Switch, {
      props: { label: "Alerts", size: "xl", disabled: true },
    });

    expect(checkbox.get("label").attributes("data-size")).toBe("sm");
    expect(checkbox.get("label").attributes("data-disabled")).toBe("true");
    expect(radio.get("label").attributes("data-size")).toBe("lg");
    expect(radio.get("label").attributes("data-disabled")).toBe("true");
    expect(toggle.get("label").attributes("data-size")).toBe("xl");
    expect(toggle.get("label").attributes("data-disabled")).toBe("true");
  });
});
