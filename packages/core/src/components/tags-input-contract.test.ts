import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { TagsInput } from "../index";

describe("TagsInput contract", () => {
  it("supports a stable public id while keeping the text editor as the labelled focus target", () => {
    const wrapper = mount(TagsInput, {
      props: {
        id: "skills",
        name: "skills",
        label: "Skills",
      },
    });

    expect(wrapper.get("label").attributes("for")).toBe("skills");
    expect(wrapper.get("input.dui-TagsInput-input").attributes("id")).toBe(
      "skills",
    );
  });

  it("submits selected tags as repeated form values instead of submitting the editor draft", async () => {
    const form = document.createElement("form");
    document.body.append(form);

    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue", "Rust"],
        id: "skills",
        name: "skills",
        label: "Skills",
      },
      attachTo: form,
    });

    const editor = wrapper.get("input.dui-TagsInput-input");
    await editor.setValue("unfinished draft");

    expect(editor.attributes("name")).toBeUndefined();
    expect(new FormData(form).getAll("skills")).toEqual(["Vue", "Rust"]);

    wrapper.unmount();
    form.remove();
  });

  it("keeps readonly selected tags in form submission but excludes disabled tags", () => {
    const readonlyForm = document.createElement("form");
    document.body.append(readonlyForm);
    const readonly = mount(TagsInput, {
      props: {
        modelValue: ["Vue", "Rust"],
        name: "skills",
        readonly: true,
        ariaLabel: "Skills",
      },
      attachTo: readonlyForm,
    });

    expect(new FormData(readonlyForm).getAll("skills")).toEqual([
      "Vue",
      "Rust",
    ]);

    readonly.unmount();
    readonlyForm.remove();

    const disabledForm = document.createElement("form");
    document.body.append(disabledForm);
    const disabled = mount(TagsInput, {
      props: {
        modelValue: ["Vue", "Rust"],
        name: "skills",
        disabled: true,
        ariaLabel: "Skills",
      },
      attachTo: disabledForm,
    });

    expect(new FormData(disabledForm).getAll("skills")).toEqual([]);

    disabled.unmount();
    disabledForm.remove();
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
    expect(
      visiblyLabelled.get("input").attributes("aria-label"),
    ).toBeUndefined();
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
    expect(wrapper.emitted("update:modelValue")).toEqual([[["Vue"]]]);
  });

  it("commits Enter exactly once and clears the editor in controlled v-model usage", async () => {
    const Host = defineComponent({
      components: { TagsInput },
      setup() {
        const value = ref(["Vue", "Accessibility"]);
        return { value };
      },
      template: `
        <div>
          <TagsInput v-model="value" label="Topics" />
          <output data-selected>{{ value.join(",") }}</output>
        </div>
      `,
    });

    const wrapper = mount(Host);
    const input = wrapper.get("input.dui-TagsInput-input");

    await input.setValue("a");
    await input.trigger("keydown", { key: "Enter" });
    await nextTick();

    expect(
      wrapper.findAll(".dui-TagsInput-tag-label").map((tag) => tag.text()),
    ).toEqual(["Vue", "Accessibility", "a"]);
    expect((input.element as HTMLInputElement).value).toBe("");
    expect(wrapper.get("[data-selected]").text()).toBe("Vue,Accessibility,a");
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
    expect(
      wrapper.get("button[aria-label='Remove Vue']").attributes("disabled"),
    ).toBeDefined();
    expect(
      wrapper.get("button[aria-label='Clear tags']").attributes("disabled"),
    ).toBeDefined();
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
    expect(
      wrapper.get("button[aria-label='Remove Vue']").attributes("type"),
    ).toBe("button");
  });

  it("focuses the text editor when the non-interactive control surface is clicked", async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ["Vue"],
        ariaLabel: "Skills",
      },
      attachTo: document.body,
    });

    const input = wrapper.get("input.dui-TagsInput-input");
    expect(document.activeElement).not.toBe(input.element);

    await wrapper.get(".dui-TagsInput-control").trigger("click");
    expect(document.activeElement).toBe(input.element);

    wrapper.unmount();
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

    expect(wrapper.emitted("update:modelValue")).toEqual([[["Vue"]]]);
    expect(wrapper.emitted("remove")).toEqual([["Rust"]]);
    expect(document.activeElement).toBe(input.element);

    wrapper.unmount();
  });
});
