import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { TagsInput } from "../index";

describe("TagsInput IME regression", () => {
  it("does not commit Enter while text composition is active", async () => {
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
    const element = input.element as HTMLInputElement;

    element.dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    );
    await input.setValue("a");
    element.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
        isComposing: true,
      }),
    );
    element.dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true, data: "a" }),
    );
    await nextTick();

    expect(
      wrapper.findAll(".dui-TagsInput-tag-label").map((tag) => tag.text()),
    ).toEqual(["Vue", "Accessibility"]);
    expect(element.value).toBe("a");
    expect(wrapper.get("[data-selected]").text()).toBe("Vue,Accessibility");

    element.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      }),
    );
    await nextTick();

    expect(
      wrapper.findAll(".dui-TagsInput-tag-label").map((tag) => tag.text()),
    ).toEqual(["Vue", "Accessibility", "a"]);
    expect(element.value).toBe("");
    expect(wrapper.get("[data-selected]").text()).toBe("Vue,Accessibility,a");
  });
});
