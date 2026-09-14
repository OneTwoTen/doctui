import { existsSync, readFileSync } from "node:fs";
import { TextInput } from "@doctui/core";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  YearPicker,
} from "./index";

describe("@doctui/dates visual contracts", () => {
  it("reuses the core TextInput geometry for the native DateInput field", () => {
    const date = mount(DateInput, {
      props: {
        modelValue: "2026-09-14",
        label: "Release date",
        description: "Native date control",
        size: "lg",
        radius: "lg",
        clearable: true,
      },
    });

    expect(date.findComponent(TextInput).exists()).toBe(true);
    expect(date.get('input[type="date"]').exists()).toBe(true);
  });

  it("renders DatePicker as a doctui text control instead of browser-native date chrome", () => {
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: "2026-09-14",
        label: "Release date",
        locale: "en-US",
        placeholder: "Select a date",
        size: "md",
        radius: "md",
        clearable: true,
      },
    });

    expect(wrapper.find('input[type="date"]').exists()).toBe(false);
    const input = wrapper.get('input[type="text"]');
    expect(input.attributes("readonly")).toBeDefined();
    expect(input.element.value).toContain("Sep");
    expect(
      wrapper.get(".dui-DatePicker__toggle svg").attributes("data-dui-icon"),
    ).toBe("calendar");
    expect(
      wrapper.get(".dui-DatePicker__clear svg").attributes("data-dui-icon"),
    ).toBe("x");
  });

  it("switches DatePicker from day to month to year views", async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        modelValue: "2026-09-14",
        locale: "en-US",
      },
    });

    await wrapper.get('input[type="text"]').trigger("click");
    expect(wrapper.find(".dui-Calendar").exists()).toBe(true);

    await wrapper.get(".dui-Calendar__titleButton").trigger("click");
    expect(wrapper.find(".dui-MonthPicker").exists()).toBe(true);

    await wrapper.get(".dui-DateSurface__titleButton").trigger("click");
    expect(wrapper.find(".dui-YearPicker").exists()).toBe(true);

    wrapper.unmount();
  });

  it("renders DateTimePicker with custom date and time controls", async () => {
    const wrapper = mount(DateTimePicker, {
      attachTo: document.body,
      props: {
        modelValue: "2026-09-14T09:30",
        label: "Publish at",
        locale: "en-US",
      },
    });

    expect(wrapper.find('input[type="datetime-local"]').exists()).toBe(false);
    const trigger = wrapper.get('input[type="text"]');
    expect(trigger.attributes("readonly")).toBeDefined();

    await trigger.trigger("click");
    expect(wrapper.find(".dui-DateTimePicker__panel").exists()).toBe(true);
    expect(wrapper.get('[aria-label="Hour"]').exists()).toBe(true);
    expect(wrapper.get('[aria-label="Minute"]').exists()).toBe(true);

    wrapper.unmount();
  });

  it("pages YearPicker through year ranges", async () => {
    const wrapper = mount(YearPicker, {
      props: {
        modelValue: 2026,
        minYear: 1900,
        maxYear: 2100,
      },
    });

    const before = wrapper.get(".dui-YearPicker__range").text();
    await wrapper.get('[aria-label="Next years"]').trigger("click");
    const after = wrapper.get(".dui-YearPicker__range").text();

    expect(after).not.toBe(before);
    expect(wrapper.findAll('[role="option"]').length).toBeGreaterThan(0);
  });

  it("uses SVG navigation icons and keeps Calendar visually token-driven", async () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: "2026-09-14", month: "2026-09" },
    });

    const nav = wrapper.findAll(".dui-Calendar__nav");
    expect(nav).toHaveLength(2);
    expect(nav[0]?.get("svg").attributes("data-dui-icon")).toBe("chevron-left");
    expect(nav[1]?.get("svg").attributes("data-dui-icon")).toBe(
      "chevron-right",
    );
    expect(wrapper.text()).not.toContain("‹");
    expect(wrapper.text()).not.toContain("›");
  });

  it("loads the extracted dates stylesheet in the Storybook visual review surface", () => {
    const preview = readFileSync(
      "apps/storybook/.storybook/preview.ts",
      "utf8",
    );

    expect(preview).toContain('import "@doctui/dates/styles.css";');
  });

  it("only references theme color tokens that exist in core", () => {
    const styles = readFileSync("packages/dates/src/styles.css", "utf8");

    expect(styles).not.toContain("--dui-color-surface-muted");
    expect(styles).toContain("--dui-color-neutral-subtle-hover");
  });

  it("provides args and explicit controls for every public date component", () => {
    const storyFiles = [
      "date-picker.stories.ts",
      "date-input.stories.ts",
      "date-time-picker.stories.ts",
      "calendar.stories.ts",
      "month-picker.stories.ts",
      "year-picker.stories.ts",
    ];

    for (const storyFile of storyFiles) {
      const path = `apps/storybook/stories/${storyFile}`;
      expect(existsSync(path), `${storyFile} should exist`).toBe(true);
      const story = readFileSync(path, "utf8");
      expect(story, `${storyFile} should define argTypes`).toContain(
        "argTypes:",
      );
      expect(story, `${storyFile} should define default args`).toContain(
        "args:",
      );
      expect(story, `${storyFile} should expose a Playground`).toContain(
        "export const Playground",
      );
    }
  });
});
