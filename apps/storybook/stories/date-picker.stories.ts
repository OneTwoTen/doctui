import { DatePicker } from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/DatePicker",
  component: DatePicker,
  args: {
    modelValue: "2026-09-14",
    label: "Release date",
    description: "Choose when the release becomes available.",
    placeholder: "Select date",
    minDate: "2026-09-01",
    maxDate: "2026-10-31",
    disabled: false,
    clearable: true,
    locale: "en-US",
    firstDayOfWeek: 1,
    size: "md",
    radius: "md",
  },
  argTypes: {
    id: { control: "text", table: { category: "Accessibility" } },
    modelValue: { control: "text", table: { category: "Value" } },
    label: { control: "text", table: { category: "Field" } },
    description: { control: "text", table: { category: "Field" } },
    error: { control: "text", table: { category: "Field" } },
    ariaLabel: { control: "text", table: { category: "Accessibility" } },
    placeholder: { control: "text", table: { category: "Field" } },
    minDate: { control: "text", table: { category: "Range" } },
    maxDate: { control: "text", table: { category: "Range" } },
    disabled: { control: "boolean", table: { category: "State" } },
    clearable: { control: "boolean", table: { category: "State" } },
    locale: { control: "text", table: { category: "Localization" } },
    firstDayOfWeek: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      table: { category: "Localization" },
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { category: "Appearance" },
    },
    radius: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl", "full"],
      table: { category: "Appearance" },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h("div", { style: { maxWidth: "32rem", padding: "1.5rem" } }, [
        h(DatePicker, args),
      ]),
    ),
};
