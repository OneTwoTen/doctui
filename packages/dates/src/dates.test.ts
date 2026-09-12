import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  dateValue,
} from "./index";

describe("@doctui/dates", () => {
  it("formats values and selects a day from the visible month", async () => {
    expect(dateValue.toDateValue(new Date(2024, 0, 9))).toBe("2024-01-09");
    const wrapper = mount(Calendar, {
      props: { modelValue: "2024-01-09", month: "2024-01" },
    });
    await wrapper.get('button[aria-label="2024-01-12"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["2024-01-12"]);
    expect(wrapper.find('[data-selected="true"]').text()).toBe("9");
  });

  it("opens a picker and emits a calendar selection", async () => {
    const wrapper = mount(DatePicker, { props: { modelValue: null } });
    await wrapper.get(".dui-DatePicker__toggle").trigger("click");
    expect(wrapper.findComponent(Calendar).exists()).toBe(true);
    await wrapper.get('button[aria-label="Previous month"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("rejects invalid calendar values and generates stable Vue IDs", () => {
    expect(dateValue.parseDate("2024-02-31")).toBeNull();
    expect(dateValue.parseDate("2024-02-29")?.getDate()).toBe(29);

    const dateInput = mount(DateInput);
    const dateTimeInput = mount(DateTimePicker);
    expect(dateInput.get("input").attributes("id")).toMatch(/^dui-date-/);
    expect(dateTimeInput.get("input").attributes("id")).toMatch(
      /^dui-datetime-/,
    );
  });
});
