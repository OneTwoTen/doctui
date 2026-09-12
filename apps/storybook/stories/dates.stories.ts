import {
  Calendar,
  DatePicker,
  DateTimePicker,
  MonthPicker,
  YearPicker,
} from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Dates" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pickers: Story = {
  render: () =>
    preview(() => {
      const date = ref<string | null>("2026-09-12");
      const month = ref("2026-09");
      const year = ref<number | null>(2026);
      return h(
        "div",
        { style: { display: "grid", gap: "1rem", maxWidth: "22rem" } },
        [
          h(DatePicker, {
            label: "Release date",
            modelValue: date.value,
            clearable: true,
            "onUpdate:modelValue": (value: string | null) =>
              (date.value = value),
          }),
          h(DateTimePicker, { label: "Release time" }),
          h(MonthPicker, {
            modelValue: month.value,
            "onUpdate:modelValue": (value: string) => (month.value = value),
          }),
          h(YearPicker, {
            modelValue: year.value,
            "onUpdate:modelValue": (value: number) => (year.value = value),
          }),
          h(Calendar, {
            modelValue: date.value,
            month: month.value,
            "onUpdate:modelValue": (value: string) => (date.value = value),
          }),
        ],
      );
    }),
};
