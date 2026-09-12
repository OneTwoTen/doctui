import { getComponentStorybookTitle, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: getComponentStorybookTitle("Text"),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "xs" }, () => [
        h(Text, { size: "xs" }, () => "Extra small text"),
        h(Text, { size: "sm" }, () => "Small text"),
        h(Text, { size: "md" }, () => "Medium text"),
        h(Text, { size: "lg" }, () => "Large text"),
        h(Text, { size: "xl" }, () => "Extra large text"),
      ]),
    ),
};

export const MutedAndWeight: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "xs" }, () => [
        h(Text, { muted: true }, () => "Muted supporting text"),
        h(Text, { weight: 600 }, () => "Semibold body text"),
      ]),
    ),
};
