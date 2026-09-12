import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { Autocomplete, Combobox, MultiSelect, Select } from "../index";

const data = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta", disabled: true },
  { value: "gamma", label: "Gamma" },
  { value: "delta", label: "Delta" },
] as const;

describe("Combobox focus-managed listbox contract", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
  });

  afterEach(() => {
    scrollIntoView.mockReset();
  });

  it("keeps aria-activedescendant valid when filtering shrinks the option set", async () => {
    const wrapper = mount(Combobox, {
      props: {
        data,
        searchable: true,
        ariaLabel: "Search Greek letters",
      },
      attachTo: document.body,
    });

    const input = wrapper.get("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "ArrowDown" });

    expect(input.attributes("aria-activedescendant")).toBeTruthy();

    await input.setValue("Alpha");
    await nextTick();

    const activeId = input.attributes("aria-activedescendant");
    expect(activeId).toBeTruthy();
    expect(document.getElementById(activeId)).not.toBeNull();
    expect(document.getElementById(activeId)?.textContent).toContain("Alpha");

    wrapper.unmount();
  });

  it("uses aria-activedescendant focus, skips disabled options and scrolls the active option", async () => {
    const wrapper = mount(Combobox, {
      props: {
        data: [
          { value: "disabled-first", label: "Disabled first", disabled: true },
          { value: "one", label: "One" },
          { value: "two", label: "Two" },
          { value: "disabled-last", label: "Disabled last", disabled: true },
        ],
        ariaLabel: "Choose a number",
      },
      attachTo: document.body,
    });

    const input = wrapper.get("input");
    await input.trigger("focus");
    await nextTick();

    const initialId = input.attributes("aria-activedescendant");
    expect(document.getElementById(initialId)?.textContent).toContain("One");
    expect(document.activeElement).toBe(input.element);

    await input.trigger("keydown", { key: "End" });
    await nextTick();
    const endId = input.attributes("aria-activedescendant");
    expect(document.getElementById(endId)?.textContent).toContain("Two");

    await input.trigger("keydown", { key: "Home" });
    await nextTick();
    const homeId = input.attributes("aria-activedescendant");
    expect(document.getElementById(homeId)?.textContent).toContain("One");

    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(
      document.getElementById(input.attributes("aria-activedescendant"))
        ?.textContent,
    ).toContain("Two");
    expect(scrollIntoView).toHaveBeenCalled();
    expect(document.activeElement).toBe(input.element);

    wrapper.unmount();
  });

  it("supports a public id and always gives the native combobox a reliable accessible name", async () => {
    const labelled = mount(Combobox, {
      props: {
        id: "country",
        data,
        label: "Country",
      },
    });

    await labelled.get("input").trigger("focus");
    expect(labelled.get("label").attributes("for")).toBe("country");
    expect(labelled.get("input").attributes("id")).toBe("country");
    expect(labelled.get("[role='listbox']").attributes("id")).toBe(
      "country-listbox",
    );

    const ariaLabelled = mount(Combobox, {
      props: { id: "city", data, ariaLabel: "City" },
    });
    expect(ariaLabelled.get("input").attributes("aria-label")).toBe("City");

    const fallback = mount(Combobox, {
      props: { id: "fallback", data },
    });
    expect(fallback.get("input").attributes("aria-label")).toBe(
      "Select option",
    );

    const multipleFallback = mount(Combobox, {
      props: { id: "multiple-fallback", data, multiple: true },
    });
    expect(multipleFallback.get("input").attributes("aria-label")).toBe(
      "Select options",
    );
  });

  it("keeps empty results free of stale active descendants and closes on Escape", async () => {
    const wrapper = mount(Combobox, {
      props: {
        data,
        searchable: true,
        ariaLabel: "Search options",
        nothingFound: "No matches",
      },
    });

    const input = wrapper.get("input");
    await input.trigger("focus");
    await input.setValue("zzzz");
    await nextTick();

    expect(input.attributes("aria-activedescendant")).toBeUndefined();
    expect(wrapper.get("[data-dui-combobox-empty]").text()).toBe("No matches");

    await input.trigger("keydown", { key: "Escape" });
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find("[role='listbox']").exists()).toBe(false);
  });

  it("never makes a disabled option active through pointer hover", async () => {
    const wrapper = mount(Combobox, {
      props: { data, ariaLabel: "Choose an option" },
    });

    const input = wrapper.get("input");
    await input.trigger("focus");
    const disabled = wrapper.findAll("[role='option']")[1];
    await disabled.trigger("mouseenter");

    const activeId = input.attributes("aria-activedescendant");
    expect(document.getElementById(activeId)?.textContent).not.toContain(
      "Beta",
    );
  });
});

describe("Combobox wrapper parity", () => {
  it.each([
    [Select, "alpha"],
    [Autocomplete, "alpha"],
    [MultiSelect, ["alpha"]],
  ] as const)("forwards clear from %s", async (component, modelValue) => {
    const wrapper = mount(component, {
      props: {
        id: "selection",
        data,
        modelValue,
        clearable: true,
        ariaLabel: "Selection",
      } as never,
    });

    await wrapper.get("button[aria-label='Clear selection']").trigger("click");
    expect(wrapper.emitted("clear")).toHaveLength(1);
  });

  it("removes the last MultiSelect value with Backspace and reflects controlled updates", async () => {
    const wrapper = mount(MultiSelect, {
      props: {
        id: "tags",
        data,
        modelValue: ["alpha", "gamma"],
        ariaLabel: "Tags",
      },
    });

    const input = wrapper.get("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "Backspace" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["alpha"]]);

    await wrapper.setProps({ modelValue: ["delta"] });
    await input.trigger("focus");
    const options = wrapper.findAll("[role='option']");
    expect(
      options
        .find((option) => option.text().includes("Delta"))
        ?.attributes("aria-selected"),
    ).toBe("true");
  });

  it("standardizes public ids across Select, Autocomplete and MultiSelect", () => {
    for (const [component, id] of [
      [Select, "select-id"],
      [Autocomplete, "autocomplete-id"],
      [MultiSelect, "multi-id"],
    ] as const) {
      const wrapper = mount(component, {
        props: {
          id,
          data,
          ariaLabel: id,
        } as never,
      });
      expect(wrapper.get("input").attributes("id")).toBe(id);
    }
  });
});
