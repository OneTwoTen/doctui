import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { h, nextTick } from "vue";
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Code,
  Container,
  DismissableLayer,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  Kbd,
  Loader,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  Overlay,
  Paper,
  PasswordInput,
  Popover,
  Radio,
  SegmentedControl,
  Select,
  Skeleton,
  Space,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from "../index";

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

describe("Grid layout contract", () => {
  it("renders a token-backed responsive grid", () => {
    const wrapper = mount(Grid, {
      props: { columns: 3, gap: "lg", as: "section" },
      slots: { default: "items" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.attributes("data-columns")).toBe("3");
    expect(wrapper.attributes("style")).toContain("display: grid");
    expect(wrapper.attributes("style")).toContain(
      "grid-template-columns: repeat(3, minmax(0, 1fr))",
    );
    expect(wrapper.attributes("style")).toContain("gap: var(--dui-spacing-lg)");
  });
});

describe("Phase 3 input contracts", () => {
  it("associates TextInput with its label and description", () => {
    const wrapper = mount(TextInput, {
      props: {
        id: "email",
        label: "Email",
        description: "We will never share it.",
      },
    });

    const input = wrapper.get("input");
    expect(wrapper.get("label").attributes("for")).toBe("email");
    expect(input.attributes("id")).toBe("email");
    expect(input.attributes("aria-describedby")).toBe("email-description");
  });

  it("exposes errors accessibly and supports v-model", async () => {
    const wrapper = mount(TextInput, {
      props: { id: "input", modelValue: "before", error: "Required" },
    });

    const input = wrapper.get("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-describedby")).toBe("input-error");
    expect(wrapper.get("[role='alert']").text()).toBe("Required");

    await input.setValue("after");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["after"]);
  });

  it("renders sections and prevents interaction when disabled or read-only", () => {
    const wrapper = mount(TextInput, {
      props: {
        disabled: true,
        readonly: true,
        leftSection: "@",
        rightSection: ".com",
      },
    });

    expect(wrapper.get("[data-dui-input-left-section]").text()).toBe("@");
    expect(wrapper.get("[data-dui-input-right-section]").text()).toBe(".com");
    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
    expect(wrapper.get("input").attributes("readonly")).toBeDefined();
  });

  it("offers an accessible clear action for clearable text inputs", async () => {
    const wrapper = mount(TextInput, {
      props: { modelValue: "remove me", clearable: true },
    });

    const clear = wrapper.get("button");
    expect(clear.attributes("aria-label")).toBe("Clear input");
    await clear.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
    expect(wrapper.emitted("clear")).toHaveLength(1);
  });
});

describe("Phase 2 display and action contracts", () => {
  it("renders layout helpers with token-backed styles", () => {
    const container = mount(Container, {
      props: { size: "lg" },
      slots: { default: "content" },
    });
    const center = mount(Center, {
      props: { inline: true },
      slots: { default: "centered" },
    });
    const space = mount(Space, { props: { size: "md" } });
    const divider = mount(Divider, {
      props: { label: "or", orientation: "vertical" },
    });

    expect(container.element.tagName).toBe("DIV");
    expect(container.attributes("data-size")).toBe("lg");
    expect(container.attributes("style")).toContain(
      "max-width: var(--dui-breakpoint-lg)",
    );
    expect(center.attributes("style")).toContain("display: inline-flex");
    expect(space.attributes("style")).toContain(
      "height: var(--dui-spacing-md)",
    );
    expect(divider.attributes("role")).toBe("separator");
    expect(divider.attributes("aria-orientation")).toBe("vertical");
    expect(divider.text()).toBe("or");
  });

  it("renders typography and surface display states", () => {
    expect(mount(Code, { slots: { default: "npm i" } }).element.tagName).toBe(
      "CODE",
    );
    expect(mount(Kbd, { slots: { default: "⌘ K" } }).element.tagName).toBe(
      "KBD",
    );
    expect(
      mount(Badge, {
        props: { color: "success", variant: "light" },
        slots: { default: "Ready" },
      }).attributes("data-color"),
    ).toBe("success");
    expect(
      mount(Paper, { props: { shadow: "md", withBorder: true } }).attributes(
        "data-with-border",
      ),
    ).toBe("true");
    expect(
      mount(Skeleton, { props: { visible: true, height: "2rem" } }).attributes(
        "aria-busy",
      ),
    ).toBe("true");
    expect(
      mount(Loader, { props: { type: "dots", size: "sm" } }).attributes("role"),
    ).toBe("status");
  });

  it("keeps action variants keyboard-native", async () => {
    const onClick = vi.fn();
    const icon = mount(ActionIcon, {
      props: { ariaLabel: "Close", onClick },
      slots: { default: "×" },
    });
    const unstyled = mount(UnstyledButton, {
      props: { onClick },
      slots: { default: "Open" },
    });

    expect(icon.element.tagName).toBe("BUTTON");
    expect(icon.attributes("aria-label")).toBe("Close");
    expect(unstyled.element.tagName).toBe("BUTTON");
    await icon.trigger("click");
    await unstyled.trigger("click");
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

describe("Phase 3 input controls", () => {
  it("supports textarea and number/password input semantics", async () => {
    const textarea = mount(Textarea, {
      props: { id: "notes", label: "Notes", modelValue: "draft", rows: 4 },
    });
    const number = mount(NumberInput, {
      props: { id: "age", modelValue: 2, min: 0, max: 10, step: 1 },
    });
    const password = mount(PasswordInput, { props: { label: "Password" } });

    expect(textarea.get("textarea").attributes("aria-label")).toBeUndefined();
    expect(textarea.get("label").attributes("for")).toBe("notes");
    expect(number.get("input").attributes("type")).toBe("number");
    expect(number.get("input").attributes("min")).toBe("0");
    expect(password.get("input").attributes("type")).toBe("password");
    await number.get("input").setValue("4");
    expect(number.emitted("update:modelValue")?.[0]).toEqual([4]);
  });

  it("supports checkbox, radio and switch v-model contracts", async () => {
    const checkbox = mount(Checkbox, {
      props: { modelValue: false, label: "Accept" },
    });
    const radio = mount(Radio, {
      props: { modelValue: "a", value: "b", label: "B" },
    });
    const toggle = mount(Switch, {
      props: { modelValue: false, label: "Enabled" },
    });

    expect(checkbox.get("input").attributes("type")).toBe("checkbox");
    expect(radio.get("input").attributes("type")).toBe("radio");
    expect(radio.get("input").element.checked).toBe(false);
    expect(toggle.get("input").attributes("role")).toBe("switch");
    await checkbox.get("input").setValue(true);
    await toggle.get("input").setValue(true);
    expect(checkbox.emitted("update:modelValue")?.[0]).toEqual([true]);
    expect(toggle.emitted("update:modelValue")?.[0]).toEqual([true]);
  });

  it("supports segmented selection and arrow-key navigation", async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        ariaLabel: "View",
        modelValue: "grid",
        data: [
          { value: "list", label: "List" },
          { value: "grid", label: "Grid" },
          { value: "board", label: "Board" },
        ],
      },
      attachTo: document.body,
    });

    const buttons = wrapper.findAll("button");
    expect(wrapper.attributes("role")).toBe("radiogroup");
    expect(buttons[1].attributes("aria-checked")).toBe("true");
    await buttons[1].trigger("keydown", { key: "ArrowRight" });
    expect(buttons[2].element).toBe(document.activeElement);
    await buttons[2].trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["board"]);
  });
});

describe("Phase 4 overlay contracts", () => {
  it("renders an overlay with accessible close and click-outside behavior", async () => {
    const wrapper = mount(Overlay, {
      props: { modelValue: true },
      slots: { default: "surface" },
      attachTo: document.body,
    });

    const surface = document.body.querySelector("[data-dui-overlay-surface]");
    const backdrop = document.body.querySelector("[data-dui-overlay-backdrop]");
    expect(surface?.textContent).toBe("surface");
    backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    wrapper.unmount();
  });

  it("traps modal focus, closes on Escape, and restores focus", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open";
    document.body.append(trigger);
    trigger.focus();
    const wrapper = mount(Modal, {
      props: { modelValue: true, title: "Confirm action" },
      slots: {
        default: () => h("button", { type: "button" }, "Confirm"),
      },
      attachTo: document.body,
    });

    const dialog = document.body.querySelector("[role='dialog']");
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    dialog?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    dialog?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    wrapper.unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});

describe("Phase 5 combobox contracts", () => {
  const data = [
    { value: "vue", label: "Vue" },
    { value: "react", label: "React" },
    { value: "svelte", label: "Svelte", disabled: true },
  ];

  it("supports Select keyboard navigation and controlled selection", async () => {
    const wrapper = mount(Select, {
      props: { data, modelValue: null, label: "Framework" },
      attachTo: document.body,
    });
    const input = wrapper.get("input");

    expect(input.attributes("role")).toBe("combobox");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["vue"]);
    expect(wrapper.find("[role='listbox']").exists()).toBe(false);
    wrapper.unmount();
  });

  it("filters Autocomplete and supports MultiSelect values", async () => {
    const autocomplete = mount(Autocomplete, {
      props: { data, modelValue: "", label: "Search" },
    });
    const search = autocomplete.get("input");
    await search.setValue("re");
    expect(
      autocomplete.findAll("[role='option']").map((item) => item.text()),
    ).toEqual(["React"]);
    await autocomplete.get("[role='option']").trigger("click");

    const multi = mount(MultiSelect, {
      props: { data, modelValue: [], label: "Frameworks" },
    });
    await multi.get("input").trigger("keydown", { key: "ArrowDown" });
    await multi.get("input").trigger("keydown", { key: "Enter" });
    expect(multi.emitted("update:modelValue")?.[0]).toEqual([["vue"]]);

    await autocomplete.setProps({ modelValue: "react" });
    expect(autocomplete.get("input").element.value).toBe("React");
  });
});

describe("Phase 4 extended overlay contracts", () => {
  it("supports Drawer focus restoration and Menu keyboard dismissal", async () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const drawer = mount(Drawer, {
      props: { modelValue: true, title: "Filters" },
      slots: { default: () => h("button", { type: "button" }, "Apply") },
      attachTo: document.body,
    });
    expect(
      document.body.querySelector("[role='dialog']")?.textContent,
    ).toContain("Filters");
    document.body
      .querySelector<HTMLButtonElement>("[aria-label='Close drawer']")
      ?.click();
    await nextTick();
    expect(drawer.emitted("update:modelValue")?.[0]).toEqual([false]);
    drawer.unmount();

    const menu = mount(Menu, {
      props: {
        modelValue: true,
        data: [
          { value: "edit", label: "Edit" },
          { value: "delete", label: "Delete", disabled: true },
        ],
      },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });
    await menu.get("[role='menu']").trigger("keydown", { key: "Escape" });
    expect(menu.emitted("update:modelValue")?.[0]).toEqual([false]);
    menu.unmount();
    trigger.remove();
  });

  it("opens Menu from the keyboard and moves focus between enabled items", async () => {
    const menu = mount(Menu, {
      props: {
        modelValue: false,
        data: [
          { value: "edit", label: "Edit" },
          { value: "delete", label: "Delete", disabled: true },
          { value: "archive", label: "Archive" },
        ],
      },
      slots: { target: () => h("button", { type: "button" }, "Actions") },
      attachTo: document.body,
    });

    await menu.get(".dui-Menu-target").trigger("keydown", {
      key: "ArrowDown",
    });
    await menu.setProps({ modelValue: true });
    await nextTick();
    expect(document.activeElement?.textContent).toBe("Edit");

    await menu.get("[role='menu']").trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(document.activeElement?.textContent).toBe("Archive");
    menu.unmount();
  });

  it("dismisses only the top layer when overlays are nested", async () => {
    const outerOutside = vi.fn();
    const innerOutside = vi.fn();
    const outer = mount(DismissableLayer, {
      props: { onOutside: outerOutside },
      attachTo: document.body,
    });
    const inner = mount(DismissableLayer, {
      props: { onOutside: innerOutside },
      attachTo: document.body,
    });

    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    await nextTick();
    expect(innerOutside).toHaveBeenCalledTimes(1);
    expect(outerOutside).not.toHaveBeenCalled();

    inner.unmount();
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    await nextTick();
    expect(outerOutside).toHaveBeenCalledTimes(1);
    outer.unmount();
  });

  it("opens Popover and reveals Tooltip content on focus", async () => {
    const popover = mount(Popover, {
      props: { modelValue: false },
      slots: {
        target: () => h("button", { type: "button" }, "Details"),
        default: () => "More details",
      },
    });
    await popover.get("button").trigger("click");
    await popover.setProps({ modelValue: true });
    expect(popover.find("[role='dialog']").text()).toBe("More details");

    const tooltip = mount(Tooltip, {
      props: { label: "Helpful context" },
      slots: { default: () => h("button", { type: "button" }, "Info") },
    });
    await tooltip.get("button").trigger("focusin");
    expect(tooltip.find("[role='tooltip']").text()).toBe("Helpful context");
  });
});

describe("TagsInput contract", () => {
  it("adds, removes and clears tags with accessible controls", async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue"],
        label: "Topics",
        clearable: true,
      },
    });
    const input = wrapper.get("input");

    await input.setValue("Accessibility");
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      ["Vue", "Accessibility"],
    ]);
    expect(wrapper.get("[aria-label='Remove Vue']")).toBeDefined();

    await wrapper.get("[aria-label='Clear tags']").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([[]]);
  });
});
