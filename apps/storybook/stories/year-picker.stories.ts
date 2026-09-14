import { YearPicker } from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/YearPicker",
  component: YearPicker,
  args: {
    modelValue: 2026,
    minYear: 2022,
    maxYear: 2032,
    disabled: false,
    ariaLabel: "Choose release year",
  },
  argTypes: {
    modelValue: { control: "number", table: { category: "Value" } },
    minYear: { control: "number", table: { category: "Range" } },
    maxYear: { control: "number", table: { category: "Range" } },
    disabled: { control: "boolean", table: { category: "State" } },
    ariaLabel: { control: "text", table: { category: "Accessibility" } },
  },
} satisfies Meta<typeof YearPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h("div", { style: { padding: "1.5rem" } }, [h(YearPicker, args)]),
    ),
};
