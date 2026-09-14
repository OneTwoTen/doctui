import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { createSSRApp, h, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  dateValue,
  MonthPicker,
  YearPicker,
} from "./index";

async function renderDateInput() {
  return renderToString(
    createSSRApp({
      render: () =>
        h(DateInput, {
          modelValue: "2026-09-14",
          label: "Release date",
          description: "Choose a publishing date",
          error: "Date is required",
        }),
    }),
  );
}

describe("@doctui/dates SSR and field accessibility", () => {
  it("rejects overflow and malformed ISO values", () => {
    expect(dateValue.parseDate("2024-02-29")?.getDate()).toBe(29);
    expect(dateValue.parseDate("2023-02-29")).toBeNull();
    expect(dateValue.parseDate("2026-02-31")).toBeNull();
    expect(dateValue.parseDate("2026-13-01")).toBeNull();
    expect(dateValue.parseDate("2026-01-01-extra")).toBeNull();
  });

  it("uses deterministic SSR-safe field ids and description/error relationships", async () => {
    const first = await renderDateInput();
    const second = await renderDateInput();

    expect(first).toBe(second);
    expect(first).toMatch(/<label[^>]+for="([^"]+)"/);
    expect(first).toContain("aria-describedby=");
    expect(first).toContain('aria-invalid="true"');
    expect(first).toContain('role="alert"');
  });

  it("keeps clear actions disabled with their field", async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: "2026-09-14",
        label: "Release date",
        disabled: true,
        clearable: true,
      },
    });

    const clear = wrapper.get(".dui-DateInput__clear");
    expect(clear.attributes("disabled")).toBeDefined();
    await clear.trigger("click");
    expect(wrapper.emitted("clear")).toBeUndefined();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("gives DateTimePicker the same description, error and clear contract", async () => {
    const wrapper = mount(DateTimePicker, {
      props: {
        modelValue: "2026-09-14T08:30",
        label: "Release time",
        description: "Local time",
        error: "Time is unavailable",
        clearable: true,
      },
    });

    const input = wrapper.get('input[type="datetime-local"]');
    const describedBy = input.attributes("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(wrapper.get(".dui-DateInput__description").attributes("id")).toBe(
      describedBy?.split(" ")[0],
    );
    expect(wrapper.get(".dui-DateInput__error").attributes("role")).toBe(
      "alert",
    );

    await wrapper.get(".dui-DateInput__clear").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
    expect(wrapper.emitted("clear")?.[0]).toEqual([]);
  });
});

describe("@doctui/dates popup accessibility", () => {
  it("connects the trigger to the calendar and forwards disabled state", async () => {
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: null,
        label: "Release date",
        disabled: true,
      },
    });

    expect(
      wrapper.get('input[type="date"]').attributes("disabled"),
    ).toBeDefined();
    const toggle = wrapper.get(".dui-DatePicker__toggle");
    expect(toggle.attributes("disabled")).toBeDefined();
    await toggle.trigger("click");
    expect(wrapper.findComponent(Calendar).exists()).toBe(false);
  });

  it("closes on Escape and outside pointer input, restoring trigger focus for Escape", async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: { modelValue: "2026-09-14", label: "Release date" },
    });
    const toggle = wrapper.get(".dui-DatePicker__toggle");

    await toggle.trigger("click");
    const calendar = wrapper.get(".dui-Calendar");
    expect(toggle.attributes("aria-controls")).toBe(calendar.attributes("id"));
    expect(toggle.attributes("aria-haspopup")).toBe("grid");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(wrapper.find(".dui-Calendar").exists()).toBe(false);
    expect(document.activeElement).toBe(toggle.element);

    await toggle.trigger("click");
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await nextTick();
    expect(wrapper.find(".dui-Calendar").exists()).toBe(false);

    wrapper.unmount();
  });
});

describe("@doctui/dates keyboard selection models", () => {
  it("renders calendar rows/gridcells with roving focus and arrow/Home/End navigation", async () => {
    const wrapper = mount(Calendar, {
      attachTo: document.body,
      props: { modelValue: "2026-09-14", month: "2026-09" },
    });

    const grid = wrapper.get('[role="grid"]');
    expect(grid.attributes("aria-label")).toContain("September");
    expect(wrapper.findAll('[role="row"]')).toHaveLength(6);

    const selected = wrapper.get('button[aria-label="2026-09-14"]');
    expect(selected.attributes("role")).toBe("gridcell");
    expect(selected.attributes("aria-selected")).toBe("true");
    expect(selected.attributes("tabindex")).toBe("0");
    selected.element.focus();

    await selected.trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(
      wrapper.get('button[aria-label="2026-09-15"]').element,
    );

    await wrapper.get('button[aria-label="2026-09-15"]').trigger("keydown", {
      key: "Home",
    });
    expect(document.activeElement).toBe(
      wrapper.get('button[aria-label="2026-09-13"]').element,
    );

    await wrapper.get('button[aria-label="2026-09-13"]').trigger("keydown", {
      key: "End",
    });
    expect(document.activeElement).toBe(
      wrapper.get('button[aria-label="2026-09-19"]').element,
    );

    wrapper.unmount();
  });

  it("exposes month and year buttons as listbox options with keyboard roving", async () => {
    const month = mount(MonthPicker, {
      attachTo: document.body,
      props: { modelValue: "2026-09", year: 2026 },
    });
    const september = month.get('[role="option"][aria-selected="true"]');
    expect(september.attributes("tabindex")).toBe("0");
    september.element.focus();
    await september.trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(
      month.findAll('[role="option"]')[9]?.element,
    );
    month.unmount();

    const year = mount(YearPicker, {
      props: { modelValue: 2026, minYear: 2024, maxYear: 2028 },
    });
    expect(year.findAll('[role="option"]')).toHaveLength(5);
    expect(year.get('[role="option"][aria-selected="true"]').text()).toBe(
      "2026",
    );
  });
});
