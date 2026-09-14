import { DateTimePicker } from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/DateTimePicker",
  component: DateTimePicker,
  args: {
    modelValue: "2026-09-14T09:30",
    label: "Publish at",
    description:
      "Custom doctui date surface with explicit hour and minute controls.",
    placeholder: "Select date and time",
    minDate: "2026-01-01",
    maxDate: "2027-12-31",
    locale: "en-US",
    firstDayOfWeek: 1,
    disabled: false,
    clearable: true,
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
    locale: { control: "text", table: { category: "Localization" } },
    firstDayOfWeek: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      table: { category: "Localization" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    clearable: { control: "boolean", table: { category: "State" } },
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
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h("div", { style: { maxWidth: "32rem", padding: "1.5rem" } }, [
        h(DateTimePicker, args),
      ]),
    ),
};
