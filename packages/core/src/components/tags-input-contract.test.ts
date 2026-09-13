import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { TagsInput } from "../index";

describe("TagsInput contract", () => {
  it("supports a stable public id and forwards name to the native input", () => {
    const wrapper = mount(TagsInput, {
      props: {
        id: "skills",
        name: "skills",
        label: "Skills",
      },
    });

    expect(wrapper.get("label").attributes("for")).toBe("skills");
    expect(wrapper.get("input").attributes("id")).toBe("skills");
    expect(wrapper.get("input").attributes("name")).toBe("skills");
  });

  it("always gives the native input a reliable accessible name", () => {
    const fallback = mount(TagsInput);
    expect(fallback.get("input").attributes("aria-label")).toBe("Tags");

    const ariaLabelled = mount(TagsInput, {
      props: { ariaLabel: "Project skills" },
    });
    expect(ariaLabelled.get("input").attributes("aria-label")).toBe(
      "Project skills",
    );

    const visiblyLabelled = mount(TagsInput, {
      props: { id: "topics", label: "Topics" },
    });
    expect(visiblyLabelled.get("input").attributes("aria-label")).toBeUndefined();
    expect(visiblyLabelled.get("label").attributes("for")).toBe("topics");
  });

  it("parses multi-character separators as one atomic controlled update", async () => {
    const wrapper = mount(TagsInput, {
      props: {
        separator: "||",
        ariaLabel: "Tags",
      },
    });

    const input = wrapper.get("input");
    await input.setValue(" Vue || Accessibility || Rust ");

    expect(wrapper.emitted("update:modelValue")).toEqual([
      [["Vue", "Accessibility"]],
    ]);
    expect(wrapper.emitted("add")).toEqual([["Vue"], ["Accessibility"]]);
    expect((input.element as HTMLInputElement).value).toBe(" Rust ");
  });

  it("only treats single-character separators as keyboard delimiter keys", async () => {
    const wrapper = mount(TagsInput, {
      props: {
        separator: "||",
        ariaLabel: "Tags",
      },
    });

    const input = wrapper.get("input");
    await input.setValue("Vue");
    await input.trigger("keydown", { key: "||" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")).toEqual([[['Vue']]]);
  });

  it("trims values, rejects duplicates and enforces maxTags across pasted batches", async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue"],
        maxTags: 3,
        separator: ",",
        ariaLabel: "Skills",
      },
    });

    await wrapper
      .get("input")
      .setValue(" Vue , Rust , Accessibility , Extra ,");

    expect(wrapper.emitted("update:modelValue")).toEqual([
      [["Vue", "Rust", "Accessibility"]],
    ]);
    expect(wrapper.emitted("add")).toEqual([["Rust"], ["Accessibility"]]);
  });

  it.each([
    ["disabled", { disabled: true }],
    ["read-only", { readonly: true }],
  ] as const)("blocks mutation in the %s state", async (_name, state) => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue"],
        clearable: true,
        ariaLabel: "Skills",
        ...state,
      },
    });

    const input = wrapper.get("input");
    await input.trigger("keydown", { key: "Backspace" });
    await wrapper.get("button[aria-label='Remove Vue']").trigger("click");
    await wrapper.get("button[aria-label='Clear tags']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.get("button[aria-label='Remove Vue']").attributes("disabled")).toBeDefined();
    expect(wrapper.get("button[aria-label='Clear tags']").attributes("disabled")).toBeDefined();
  });

  it("exposes selected tags as a list with native remove controls", () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue", "Rust"],
        label: "Skills",
      },
    });

    const list = wrapper.get("[role='list']");
    expect(list.attributes("aria-label")).toBe("Skills selected tags");
    expect(wrapper.findAll("[role='listitem']")).toHaveLength(2);
    expect(wrapper.get("button[aria-label='Remove Vue']").attributes("type")).toBe(
      "button",
    );
  });

  it("returns focus to the input after removing a tag with its remove button", async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue", "Rust"],
        ariaLabel: "Skills",
      },
      attachTo: document.body,
    });

    const input = wrapper.get("input");
    const remove = wrapper.get("button[aria-label='Remove Vue']");
    (remove.element as HTMLButtonElement).focus();
    expect(document.activeElement).toBe(remove.element);

    await remove.trigger("click");
    await nextTick();
    expect(document.activeElement).toBe(input.element);

    wrapper.unmount();
  });

  it("removes the last tag with Backspace while keeping input focus", async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue", "Rust"],
        ariaLabel: "Skills",
      },
      attachTo: document.body,
    });

    const input = wrapper.get("input");
    (input.element as HTMLInputElement).focus();
    await input.trigger("keydown", { key: "Backspace" });

    expect(wrapper.emitted("update:modelValue")).toEqual([[['Vue']]]);
    expect(wrapper.emitted("remove")).toEqual([["Rust"]]);
    expect(document.activeElement).toBe(input.element);

    wrapper.unmount();
  });
});
